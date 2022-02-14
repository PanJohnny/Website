# Website
My portfolio webiste.

This is command line like website that I made in a few days. The pages are currently rendered cliet side using express.js. Please note that this is not a final version and I only show some of my projects.

## Endpoints
 / - command line
 /projects - projects
 /projects/p-:project - project by name
 params:
 - project - project name, lower case and '-' without ' '

 /projects/t-:tag - all projects by tag
 params:
- tag - tag name

## How to build
 1) Install all dependencies
    Use `npm install`
 2) Add .env file
    Creae new line named `.env`. The file should look like this:
    ```env
    WEBHOOK_ID = "id" 
    WEBHOOK_TOKEN = "token"
    ```
3) Run
    Now you can run the page usign `node .`

## Adding project
In directory `/projects/projects` there is `.template.json` copy the file and edit the json. Some of the fields are optional but I recommend using them.

```json
{
    "license": {
        "name": "MIT",
        "url": "license"
    },
    "github": {
        "name": "PanJohnny/Project",
        "url": "https://github.com/PanJohnny/Project"
    },
    "tags": [
        "tag1",
        "tag2"
    ],
    "languages": [
        "JavaScript",
        "HTML"
    ],
    "description": "Short description.",
    "name": "Project",
    "links": [
        {
            "name": "Link",
            "url": "link",
            "_comment": "Icon is optional",
            "icon": "fa fa-globe"
        },
        {
            "name": "Link",
            "url": "link"
        }
    ],
    "body": {
        "categories": [
            {
                "name": "About",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel interdum consectetur, nisl nunc egestas nisi, euismod aliquam nisl nunc eget nunc. Nullam euismod, nisi vel interdum consectetur, nisl nunc egestas nisi, euismod aliquam nisl nunc eget nunc."
            }
        ]
    }
}
```
