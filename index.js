const fs = require('fs-extra');
const path = require('path');

// Make sure to change to the correct source and destination path!
const bearNotesFolderPath = './BearExport';
const obsidianVaultFolderPath = './ObsidianExport';

// Read Bear notes and folders from the directory
const filesAndFolders = fs.readdirSync(bearNotesFolderPath);

function updateFileDates(notePath, creationDate, editedDate) {
    const birthtime = new Date(creationDate);
    const mtime = new Date(editedDate);
    fs.utimesSync(notePath, birthtime, mtime);
}

//switched to moving original file instead of using frontmatter
// function addCreationAndEditedDateFrontmatter(content, creationDate, editedDate) {
//     const frontmatter = `---\ncreated: ${creationDate}\nmodified: ${editedDate}\n---\n\n`;
//     return frontmatter + content;
// }

filesAndFolders.forEach(entry => {
    const entryPath = path.join(bearNotesFolderPath, entry);
    const entryStats = fs.statSync(entryPath);

    // If the entry is a markdown file
    if (entryStats.isFile() && path.extname(entry) === '.md') {
        let content = fs.readFileSync(entryPath, 'utf8');

        // // Get the creation date and edited date from the file
        const creationDate = fs.statSync(entryPath).birthtime.toISOString();
        // console.log(creationDate)
        const editedDate = fs.statSync(entryPath).mtime.toISOString();

        // // Add the creation date and edited date as YAML frontmatter
        // content = addCreationAndEditedDateFrontmatter(content, creationDate, editedDate);

        // Find tags in the note (working)
        const firstTagRegex = /(^|\s)#(?:(\w+(?:\/\w+)*(?:\s+-\s+\w+)*\s*)|(\w+))(?!\w)/g;
        const allTagRegex = /(^|\s)#(?:(\w+\/(?:[\w\s-]+\/)*[\w\s-]+)|(\w+))(?!\w)/g;
        const tags = [...content.matchAll(firstTagRegex)].map(match => match[2] || match[3]).map(tag => tag.trim());
        // console.log(tags);

        // Replace Bear tags with Obsidian tags and formate highlight
        const obsidianContent = content
            .replace(/::([\s\S]*?)::/g, "==$1==")
            .replaceAll(allTagRegex, (_, space, tagName1, tagName2) => {
                const tagName = tagName1 || tagName2;
                const cleanedTagName = tagName.replace(/\//g, '/');
                const trimmedTagName = cleanedTagName.trim();
                const tagWithoutSpaces = trimmedTagName.replace(/\s+/g, '_');
                return `${space}#${tagWithoutSpaces}`;
            });

        // Replace Bear-style note links with Obsidian-style note links
        const obsidianLinksContent = obsidianContent.replace(/\[{2}([^\]]+)\]{2}/g, (_, noteTitle) => `[[${noteTitle}]]`);

        // Save the note in the Obsidian vault
        let noteFolder = obsidianVaultFolderPath;
        if (tags.length > 0) {
            const firstTag = tags[0].trim(); // Trim the first tag to remove any leading or trailing white space characters
            noteFolder = path.join(obsidianVaultFolderPath, firstTag);
            if (!fs.existsSync(noteFolder)) {
                const tagLevels = firstTag.split('/');
                let folderPath = obsidianVaultFolderPath;
                for (let i = 0; i < tagLevels.length; i++) {
                    folderPath = path.join(folderPath, tagLevels[i]);
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, { recursive: true });
                    }
                }
            }
        }
        const noteTitle = entry.replace('.md', '');
        const newNotePath = path.join(noteFolder, noteTitle + '.md');
        if (fs.existsSync(newNotePath)) {
            let i = 1;
            while (fs.existsSync(`${newNotePath}_${i}.md`)) {
                i++;
            }
            fs.writeFileSync(entryPath, obsidianLinksContent); // Modify the file in place
            fs.moveSync(entryPath, `${newNotePath}_${i}.md`, { preserveTimestamps: true }); // Copy the file to the new export folder
            updateFileDates(`${newNotePath}_${i}.md`, creationDate, editedDate); //attempt to update original mTime instead ot when this is run
        } else {
            fs.writeFileSync(entryPath, obsidianLinksContent); // Modify the file in place
            fs.moveSync(entryPath, newNotePath, { preserveTimestamps: true }); // Copy the file to the new export folder
            updateFileDates(newNotePath, creationDate, editedDate);
        }
    }

    // If the entry is a folder (attachments)
    if (entryStats.isDirectory()) {
        const assetsFolderPath = path.join(obsidianVaultFolderPath, 'assets');
        fs.mkdirSync(assetsFolderPath, { recursive: true });
        const newFolderPath = path.join(assetsFolderPath, entry);
        fs.moveSync(entryPath, newFolderPath); // Move the folder to the new export folder
    }
});