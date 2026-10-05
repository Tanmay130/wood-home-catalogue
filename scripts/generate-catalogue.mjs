import fs from 'fs';
import path from 'path';

const CATEGORY_MAPPING = [
  { id: 1, numberStr: '01', name: '5-Seater Sofa', folderName: '01-5-seater-sofa' },
  { id: 2, numberStr: '02', name: 'Bean Bag', folderName: '02-bean-bag' },
  { id: 3, numberStr: '03', name: 'Centre Tables', folderName: '02-centre-tables' },
  { id: 4, numberStr: '04', name: 'Beauty Parlour Chair', folderName: '03-beauty-parlour-chair' },
  { id: 5, numberStr: '05', name: 'Birla Cement School Furniture', folderName: '04-birla-cement-school-furniture' },
  { id: 6, numberStr: '06', name: 'Box Type Dewan / Sethi', folderName: '05-box-type-dewan-sethi' },
  { id: 7, numberStr: '07', name: 'Carpet', folderName: '06-carpet' },
  { id: 8, numberStr: '08', name: 'Conference Table', folderName: '08-conference-table' },
  { id: 9, numberStr: '09', name: 'Cooler', folderName: '09-cooler' },
  { id: 10, numberStr: '10', name: 'Corner Stand', folderName: '10-corner-stand' },
  { id: 11, numberStr: '11', name: 'Cushion Double Bed', folderName: '11-cushion-double-bed' },
  { id: 12, numberStr: '12', name: 'Digital Glass', folderName: '12-digital-glass' },
  { id: 13, numberStr: '13', name: 'Dining Set', folderName: '12-dining-set' },
  { id: 14, numberStr: '14', name: 'Door Windows', folderName: '14-door-windows' },
  { id: 15, numberStr: '15', name: 'Double Bed', folderName: '15-double-bed' },
  { id: 16, numberStr: '16', name: 'Dressing Table', folderName: '16-dressing-table' },
  { id: 17, numberStr: '17', name: 'Garden Furniture', folderName: '17-garden-furniture' },
  { id: 18, numberStr: '18', name: 'Iron Almirah', folderName: '18-iron-almirah' },
  { id: 19, numberStr: '19', name: 'Kitchen', folderName: '19-kitchen' },
  { id: 20, numberStr: '20', name: 'LCD TV Unit', folderName: '20-lcd-tv-unit' },
  { id: 21, numberStr: '21', name: 'Love Sethi', folderName: '21-love-sethi' },
  { id: 22, numberStr: '22', name: 'Mandir', folderName: '22-mandir' },
  { id: 23, numberStr: '23', name: 'Office Chair', folderName: '23-office-chair' },
  { id: 24, numberStr: '24', name: 'Office Table', folderName: '24-office-table' },
  { id: 25, numberStr: '25', name: 'Additional Chairs', folderName: '25-additional-chairs' },
  { id: 26, numberStr: '26', name: 'Office Table (PLT)', folderName: '25-office-table-plt' },
  { id: 27, numberStr: '27', name: 'Rocking Chair', folderName: '26-rocking-chair' },
  { id: 28, numberStr: '28', name: 'Shield Showcase', folderName: '28-shield-showcase' },
  { id: 29, numberStr: '29', name: 'Shree Cement Furniture', folderName: '29-shree-cement-furniture' },
  { id: 30, numberStr: '30', name: 'Single Bed (4x6)', folderName: '30-single-bed-4x6' },
  { id: 31, numberStr: '31', name: 'Slotted Rack', folderName: '31-slotted-rack' },
  { id: 32, numberStr: '32', name: 'Sofa Cum Bed', folderName: '32-sofa-cum-bed' },
  { id: 33, numberStr: '33', name: 'Teakwood Carving Bed', folderName: '32-teakwood-carving-bed' },
  { id: 34, numberStr: '34', name: 'Sofa Set', folderName: '33-sofa-set' },
  { id: 35, numberStr: '35', name: 'Student Table Chair', folderName: '34-student-table-chair' },
  { id: 36, numberStr: '36', name: 'Visitor Wood Chair', folderName: '36-visitor-wood-chair' },
  { id: 37, numberStr: '37', name: 'Wooden Almirah', folderName: '37-wooden-almirah' },
  { id: 38, numberStr: '38', name: 'Wooden Sofa', folderName: '38-wooden-sofa' },
  { id: 39, numberStr: '39', name: 'Wooden Wardrobe', folderName: '39-wooden-wardrobe' }
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Convert raw folder name (e.g. "09-cooler") into clean readable title ("Cooler")
function formatCategoryName(folderName) {
  return folderName
    .replace(/^[0-9]+-/, '') // Remove leading numbers and dash
    .replace(/-/g, ' ')      // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize words
}

// Recursively find all files in subdirectories
function getAllFilesRecursively(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (file.startsWith('.')) return; // Ignore hidden files like .DS_Store
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFilesRecursively(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function generateCatalogue() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const outputDataDir = path.join(process.cwd(), 'data');
  const outputJsonPath = path.join(outputDataDir, 'catalogue.json');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  if (!fs.existsSync(outputDataDir)) {
    fs.mkdirSync(outputDataDir, { recursive: true });
  }

  // Read ALL existing directories inside public/images dynamically
  const folderEntries = fs.readdirSync(imagesDir, { withFileTypes: true });
  const categoryFolders = folderEntries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const validExtensions = [
    '.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.jfif', '.heic',
    '.mp4', '.webm', '.mov', '.m4v', '.3gp', '.mkv', '.avi'
  ];

  let totalMediaCount = 0;

  const categories = categoryFolders.map((folderName, index) => {
    const categoryName = formatCategoryName(folderName);
    const slug = slugify(categoryName);
    const categoryFolderPath = path.join(imagesDir, folderName);

    const allFilePaths = getAllFilesRecursively(categoryFolderPath);

    const mediaFiles = allFilePaths.filter((filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      return validExtensions.includes(ext);
    });

    const media = mediaFiles.map((fullFilePath, fileIndex) => {
      const ext = path.extname(fullFilePath).toLowerCase();
      const isVideo = ['.mp4', '.webm', '.mov', '.m4v', '.3gp', '.mkv', '.avi'].includes(ext);

      // Extract path relative to public/ directory
      const relativePath = path.relative(path.join(process.cwd(), 'public'), fullFilePath);
      
      // Split path into parts and encode each segment to handle spaces and special symbols safely
      const safeUrl = '/' + relativePath
        .split(path.sep)
        .map((segment) => encodeURIComponent(segment))
        .join('/');

      return {
        id: `${index + 1}-${fileIndex + 1}`,
        type: isVideo ? 'video' : 'image',
        url: safeUrl,
        title: `${categoryName} ${isVideo ? 'Video' : 'Image'} ${fileIndex + 1}`
      };
    });

    totalMediaCount += media.length;

    return {
      id: index + 1,
      name: categoryName,
      slug: slug,
      folderName: folderName,
      media: media
    };
  });

  fs.writeFileSync(outputJsonPath, JSON.stringify(categories, null, 2), 'utf-8');
  console.log(`✅ Fully indexed ${totalMediaCount} media items across ${categories.length} folders!`);
}

generateCatalogue();