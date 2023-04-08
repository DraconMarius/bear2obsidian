const fs = require('fs-extra');
const path = require('path');
//copySync copy dir with content inside
const { copySync } = require('fs-extra');

// Make sure to change to the correct source and destination path!
const bearNotesFolderPath = './BearExport';
const obsidianVaultFolderPath = './ObsidianExport';

// Read Bear notes and folders from the directory
const filesAndFolders = fs.readdirSync(bearNotesFolderPath);

filesAndFolders.forEach(entry => {
    const entryPath = path.join(bearNotesFolderPath, entry);
    const entryStats = fs.statSync(entryPath);

    // If the entry is a markdown file
    if (entryStats.isFile() && path.extname(entry) === '.md') {
        let content = fs.readFileSync(entryPath, 'utf8');

        // Find tags in the note
        const tags = [...content.matchAll(/(^|\s)#([^\s/]+(?:\/[^\s/]+)*)(?=[\s,]|$)/g)].map(match => match[2]);

        // Replace Bear tags with Obsidian tags and create a folder structure based on tags
        const obsidianContent = content.replace(/(^|\s)#([^\s/]+(?:\/[^\s/]+)*)(?=[\s,]|$)/g, (_, prefix, tagName) => {
            const cleanedTagName = tagName.replace(/\//g, '/').replace(/\s+/g, ' ');
            return `${prefix}#${cleanedTagName}`;
        });

        // Replace Bear-style note links with Obsidian-style note links
        const obsidianLinksContent = obsidianContent.replace(/\[{2}([^\]]+)\]{2}/g, (_, noteTitle) => `[[${noteTitle}]]`);

        // Save the note in the Obsidian vault
        let noteFolder = obsidianVaultFolderPath;
        if (tags.length > 0) {
            const firstTagFolderStructure = tags[0].split('/').filter(tagPart => !tagPart.startsWith('#'));
            noteFolder = path.join(obsidianVaultFolderPath, ...firstTagFolderStructure);
        }
        fs.mkdirSync(noteFolder, { recursive: true });
        const newNotePath = path.join(noteFolder, entry);
        fs.writeFileSync(newNotePath, obsidianLinksContent);
    }

    // If the entry is a folder (attachments)
    if (entryStats.isDirectory()) {
        const assetsFolderPath = path.join(obsidianVaultFolderPath, 'assets');
        fs.mkdirSync(assetsFolderPath, { recursive: true });
        const newFolderPath = path.join(assetsFolderPath, entry);
        copySync(entryPath, newFolderPath);
    }
});