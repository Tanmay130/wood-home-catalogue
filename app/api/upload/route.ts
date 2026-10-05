import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const folderName = formData.get('folderName') as string;
    const files = formData.getAll('files') as File[];

    if (!folderName || !files || files.length === 0) {
      return NextResponse.json({ error: 'Missing folder or files' }, { status: 400 });
    }

    const targetDir = path.join(process.cwd(), 'public', 'images', folderName);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let uploadedCount = 0;

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalName = file.name || `upload_${Date.now()}`;
      
      // Clean filename to prevent spaces or special symbol routing issues
      const cleanName = `${Date.now()}_${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(targetDir, cleanName);

      fs.writeFileSync(filePath, buffer);
      uploadedCount++;
    }

    // Trigger catalogue regeneration automatically after upload
    try {
      const generateModule = await import('@/scripts/generate-catalogue.mjs' as any);
      if (generateModule && generateModule.generateCatalogue) {
        generateModule.generateCatalogue();
      }
    } catch {
      // Fallback if dynamic script import isn't direct
    }

    return NextResponse.json({ success: true, count: uploadedCount });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}