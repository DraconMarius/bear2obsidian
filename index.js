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

        // Find tags in the note try to
        const tagRegex = /(^|\s)#(?:(\w+\/(?:[\w\s-]+\/)*[\w\s-]+)|(\w+))(?!\w)/g;
        const tags = [...content.matchAll(tagRegex)].map(match => match[2] || match[3]).map(tag => tag.trim());
        // console.log(tags);

        // Replace Bear tags with Obsidian tags and formate highlight
        const obsidianContent = content
            .replace(/::([\s\S]*?)::/g, "==$1==")
            .replace(tagRegex, (_, space, tagName1, tagName2) => {
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

