const fs = require('fs-extra');
const path = require('path');
//copySync copy dir with content inside
const { copySync } = require('fs-extra');

// Make sure to change to the correct source and destination path!
const bearNotesFolderPath = './BearExport';
const obsidianVaultFolderPath = './ObsidianExport';

// Read Bear notes and folders from the directory
const filesAndFolders = fs.readdirSync(bearNotesFolderPath);

function addCreationAndEditedDateFrontmatter(content, notePath) {
    const creationDate = fs.statSync(notePath).birthtime.toISOString();
    const editedDate = fs.statSync(notePath).mtime.toISOString();
    const frontmatter = `---\ncreated: ${creationDate}\nmodified: ${editedDate}\n---\n\n`;
    return frontmatter + content;
}

filesAndFolders.forEach(entry => {
    const entryPath = path.join(bearNotesFolderPath, entry);
    const entryStats = fs.statSync(entryPath);

    // If the entry is a markdown file
    if (entryStats.isFile() && path.extname(entry) === '.md') {
        let content = fs.readFileSync(entryPath, 'utf8');

        // Add the creation date and edited date as YAML frontmatter
        content = addCreationAndEditedDateFrontmatter(content, entryPath);

        // Find tags in the note
        const tagRegex = /(^|\s)#(?:(\w+\/(?:[\w\s-]+\/)*[\w\s-]+)|(\w+))(?!\w)/g;
        const tags = [...content.matchAll(tagRegex)].map(match => match[2] || match[3]);

        // Replace Bear tags with Obsidian tags
        const obsidianContent = content.replace(tagRegex, (_, space, tagName1, tagName2) => {
            const tagName = tagName1 || tagName2;
            const cleanedTagName = tagName.replace(/\//g, '/');
            return `${space}#${cleanedTagName}`;
        });

        // Replace Bear-style note links with Obsidian-style note links
        const obsidianLinksContent = obsidianContent.replace(/\[{2}([^\]]+)\]{2}/g, (_, noteTitle) => `[[${noteTitle}]]`);

        // Save the note in the Obsidian vault
        let noteFolder = obsidianVaultFolderPath;
        if (tags.length > 0) {
            const firstTag = tags[0];
            const tagLevels = firstTag.split('/');
            if (tagLevels.length > 1) {
                noteFolder = path.join(obsidianVaultFolderPath, ...tagLevels);
                noteFolder = noteFolder.replace(`${firstTag}/`, '');
                if (!fs.existsSync(noteFolder)) {
                    fs.mkdirSync(noteFolder, { recursive: true });
                }
            } else {
                noteFolder = path.join(obsidianVaultFolderPath, firstTag);
                if (!fs.existsSync(noteFolder)) {
                    fs.mkdirSync(noteFolder, { recursive: true });
                }
            }
        }
        const noteTitle = entry.replace('.md', '');
        const newNotePath = path.join(noteFolder, noteTitle + '.md');
        if (fs.existsSync(newNotePath)) {
            // If the note already exists in the folder, rename the note file to prevent overwriting
            let i = 1;
            while (fs.existsSync(`${newNotePath}_${i}.md`)) {
                i++;
            }
            fs.writeFileSync(`${newNotePath}_${i}.md`, obsidianLinksContent);
        } else {
            fs.writeFileSync(newNotePath, obsidianLinksContent);
        }
    }

    // If the entry is a folder (attachments)
    if (entryStats.isDirectory()) {
        const assetsFolderPath = path.join(obsidianVaultFolderPath, 'assets');
        fs.mkdirSync(assetsFolderPath, { recursive: true });
        const newFolderPath = path.join(assetsFolderPath, entry);
        copySync(entryPath, newFolderPath);
    }
});