
var phone = false;
if (window.location.hash == "#phone") {
    phone = true;
    document.querySelector('.phoneswitch').style.display = "inherit";
    document.querySelector('#switch').innerText = "Desktop version";
}
var directory = null;
class Command {
    // constructor
    constructor(name, callback, usage, description) {
        this.name = name;
        this.callback = callback;
        this.usage = usage;
        this.description = description;
    }

    // execute
    execute(args) {
        if (args[0] == this.name) {
            // run callback with all args (not the first one)
            return this.callback(args.slice(1));
        }
        return null;
    }

    // toString
    toString() {
        return `${this.usage}\n ${this.description}`;
    }

    getName() {
        return this.name;
    }
}

class Directory {
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }

    getChild(name) {
        for (let i = 0; i < this.children.length; i++) {
            // if the child is Diretory split it by / and get last part
            if (this.children[i] instanceof Directory) {
                let parts = this.children[i].name.split("/");
                if (parts[parts.length - 1] == name) {
                    return this.children[i];
                }
            } else {
                if (this.children[i].name == name) {
                    return this.children[i];
                }
            }
        }
        return null;
    }

    getChildren() {
        return this.children;
    }

    getParent() {
        return this.parent;
    }

    getName() {
        return this.name;
    }

    getPath() {
        let path = this.name;
        let current = this;
        while (current.parent) {
            current = current.parent;
            path = current.name + "\\" + path;
        }
        return path;
    }

    createChildDirectory(name) {
        let child = new Directory(name, this);
        this.addChild(child);
        return child;
    }

    createChildFile(name, openCallback) {
        let child = new File(name, this, openCallback);
        this.addChild(child);
        return child;
    }

    getAllChildren() {
        let children = [];
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] instanceof Directory) {
                children.push(this.children[i])
                var all = this.children[i].getAllChildren()

                all.forEach(element => {
                    children.push(element)
                });
            } else {
                children.push(this.children[i]);
            }
            console.log(children);
        }
        return children;
    }

    getFiles() {
        let files = [];
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] instanceof File) {
                files.push(this.children[i]);
            }
        }
        return files;
    }

    generateTree(child) {
        // generate tree with all children
        let all;
        if (child) {
            all = child.getAllChildren();
        } else {
            all = this.getAllChildren();
        }
        // generate tree to be displayed as string
        let tree = "";
        for (let i = 0; i < all.length; i++) {
            var current = all[i]
            if (current instanceof Directory) {
                tree += "█ " + current.getPath() + "\n";
            } else {
                tree += "| - " + current.getName() + "\n";
            }
        }
        return tree;
    }
}

class File {
    constructor(name, parent, openCallback) {
        this.name = name;
        this.parent = parent;
        this.openCallback = openCallback;
    }

    getParent() {
        return this.parent;
    }

    getName() {
        return this.name;
    }

    getPath() {
        let path = this.name;
        let current = this;
        while (current.parent) {
            current = current.parent;
            path = current.name + "\\" + path;
        }
        return path;
    }

    open() {
        return this.openCallback();
    }
}
var commands = [
    new Command("echo", (args) => {
        if (args.length == 0) {
            return "";
        }
        return args.join(" ");
    }, "echo [text]", "Echoes the text"),
    new Command("help", (args) => {
        var output = "";
        for (var i = 0; i < commands.length; i++) {
            output += commands[i].toString() + "\n\n";
        }
        return output;
    }, "help", "Displays all commands"),
    new Command("open", (args) => {
        if (args.length == 0) {
            return "";
        }
        var url = args.join(" ");
        if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) {
            url = "https://" + url;
        }
        try {
            window.open(url, "_blank");
        } catch (e) {
            return "!Invalid URL";
        }
        return "Opened " + url;
    }, "open [url]", "Opens the url in a new tab"),
    new Command("cd", (args) => {
        if (args.length == 0) {
            return "!No directory specified";
        }
        var dir = args[0];
        if (dir == "..") {
            if (directory.getParent()) {
                directory = directory.getParent();
                return " ";
            } else
                return "!You are already in the root directory";
        }
        var child = directory.getChild(dir);
        if (child == null) {
            return "!Directory not found";
        }
        if (child instanceof Directory) {
            directory = child;
        } else
            return "!You cannot CD into a file, you can use 'cat' instead";
        return " ";
    }, "cd [directory]", "Changes the current directory"),
    new Command("tree", (args) => {
        var child;
        if (args.length != 0) {
            child = directory.getChild(args[0]);


            if (!child)
                return "!Directory not found";
        }

        // loop throught all children of children recurively
        var output = directory.generateTree(child)
        if (output == "") {
            return "!No files or directories found";
        }
        return output;
    }, "tree (directory)", "Displays directory tree"),
    new Command("ls", (args) => {
        var output = "/\n";
        for (var i = 0; i < directory.getChildren().length; i++) {
            if (directory.getChildren()[i] instanceof Directory) {
                output += "/" + directory.getChildren()[i].getName() + "/\n";
            } else {
                output += directory.getChildren()[i].getName() + "\n";
            }
        }
        return output;
    }, "ls", "Lists all files in the current directory"),
    new Command("cat", (args) => {
        if (args.length == 0) {
            return "!No file specified";
        }
        var file = directory.getChild(args[0]);
        if (file == null) {
            return "!File not found";
        }
        if (file instanceof File) {
            return file.open();
        }
        return "!File is not a text file";
    }, "cat [file]", "Displays the contents of the file"),
    new Command("exit", (args) => {
        document.querySelector("body").innerHTML = "Closed terminal, press F5 or reload the page to open again.";
        return " ";
    }, "exit", "Exits the terminal"),
    new Command("title", (args) => {
        var title = args.join(" ");
        if (args.length == 0) {
            return "!No title specified";
        }
        if (title == "reset") {
            document.querySelector("title").innerHTML = "PanJohnny";
            return " ";
        }
        document.querySelector("title").innerText = title;
        return " ";
    }, "title [title]", "Changes the title of the website"),
    new Command("restart", (args) => {
        location.reload();
        return " ";
    }, "restart", "Reloads the page"),
    new Command("cls", (args) => {
        document.querySelector(".container").innerHTML = "";
        return " ";
    }, "cls", "Clears the screen"),
    new Command("shutdown", (args) => {
        document.querySelector("body").innerHTML = "<img src='/assets/kilohard.png' class='full'/>";
        return " ";
    }, "shutdown", "Shuts down"),
    new Command("old", (args) => {
        window.open("https://panjohnny.github.io/old", "_blank");
        return "!Opened in a new tab\nNOTE: That page is no longer maintained and it honestly doesn't llok good, it can also contain wrong english, so please don't use it.";
    }, "old", "Opens my old website"),
    new Command("docs", (args) => {
        window.open("/docs", "_blank");
        return "Opened docs of my APIs";
    }, "docs", "Opens documentation of my API/s"),
    new Command("feedback", async (args) => {
        if (args.length < 3) {
            return "!Not enough arguments, please see usage"
        }
        return "!This feauture is currently not working, please use 'email [message]' for now";
        var name = args[0];
        var email = args[1];
        var message = "";
        for (var i = 2; i < args.length; i++) {
            message += args[i] + " ";
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/feedback", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.withCredentials = true;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status != 200) {
                return "!Error sending feedback";
            } else if (xhr.readyState == 4 && xhr.status == 200) {
                return "!Feedback sent";
            }
        }
        xhr.send(JSON.stringify({
            name: name,
            email: email,
            message: message
        }));
        // on error

        return "Thank you for your feedback, I will get back to you as soon as possible.";
    }, "feedback [name] [email] [message]", "Sends feedback to the developer"),
    new Command("email", (args) => {
        if (args.length < 1)
            return "!Not enough arguments, please see usage"

        var message = "";
        for (var i = 0; i < args.length; i++) {
            message += args[i] + " ";
        }

        window.open("mailto:janstefanca@seznam.cz?subject=PanJohnny%20Feedback&body=" + message, "_blank");
    }, "email [message]", "Sends email to the developer"),
    new Command("command", (args) => {
        if (args.length != 1)
            return "!Invalid arguments"

        var output;
        for (var i = 0; i < commands.length; i++) {
            if (commands[i].getName() == args[0]) {
                output = commands[i].toString()
            }
        }

        if (!output)
            return "!Command not found!"

        return output + "\n";
    }, "command [name]", "Returns info about command"),
    new Command("phone", (args) => {
        if (document.querySelector(".phoneswitch").style.display != "inherit") {
            document.querySelector(".phoneswitch").style.display = "inherit"
            document.querySelector("#switch").innerText = "Desktop mode"
        } else {
            document.querySelector(".phoneswitch").style.display = "";
            document.querySelector("#switch").innerText = "Phone mode"
        }
        return "Toggled phone input icon, NOTE: This does not work on phones (maybe, I am sure on like 95%)."
    }, "phone", "Toggles phone input icon"),
    new Command("version", (args) => {
        return "KiloHard Curtains [Version 13.4.6]\nMade by PanJohnny\n\nThis website is mostly client-side and the code is free to use. If you want to create a similar site or use my code please include me in credits.\nHave a nice day!"
    }, "version", "Show's info about this website"),
    new Command("projects", (args) => {
        window.open("./projects", "_blank");
        return "Opened projects page";
    }, "projects", "Opens my projects page"),
    new Command("github", (args) => {
        window.open("https://github.com/PanJohnny", "_blank");
        return "Opened GitHub page";
    }, "github", "Opens my GitHub page"),
];

initFs()
updateDir()
function initFs() {
    const root = new Directory("C:", null)
    root.createChildFile(":)", () => {
        return "¯\\_(ツ)_/¯";
    })
    const users = root.createChildDirectory("Users")
    const panjohnny = users.createChildDirectory("PanJohnny")
    const documents = panjohnny.createChildDirectory("Documents")

    documents.createChildFile("about_me.txt", () => {
        return "Hi there! I'm PanJohnny. I'm programmer from Czech Republic. I'm studying on gymnasium in Prague. I'm a big fan of programming and I'm learning it everyday.";
    })

    documents.createChildFile("languages.txt", () => {
        return "- Java\n- JavaScript\n- HTML\n- Python"
    })

    documents.createChildFile("skills.txt", () => {
        return "- Programming\n- Reading\n- Writing\n- Cooking\n- Swimming\n- Skating\n- Archery\n- Speaking Czech and English"
    })

    documents.createChildFile("contact.txt", () => {
        return "Twitter: @PanJohnny1\nGitHub: @PanJohnny\nDiscord: @PanJohnny#5594";
    })

    directory = panjohnny;
}
// on keypress append to line
document.querySelector('body').addEventListener('keypress', async function (e) {
    if (e.keyCode == 13) {
        var line = document.querySelector('.current');
        var cursor = document.querySelector('.cursor');
        await matchCommand()
        line.removeChild(cursor);
        // clone line element
        var newLine = line.cloneNode(true);
        // remove current class
        line.classList.remove('current');
        // remove cursor node from line
        // clear text from newLine
        newLine.querySelector('.text').innerHTML = '';
        // append line to container
        document.querySelector('.container').appendChild(newLine);
        cursor.setAttribute('x', 0);
        newLine.appendChild(cursor);
        updateCursor()
        updateDir()
        window.scrollTo(0, document.body.scrollHeight);
    } else {
        // append to line where cursor is
        var cursor = document.querySelector('.cursor');
        var x = parseInt(cursor.getAttribute('x'));
        cursor.setAttribute('x', x + 1);
        var line = document.querySelector('.current');
        var text = line.querySelector('.text');
        // if space is hit add a space
        if (e.keyCode == 32) {
            text.innerHTML += ' ';
        } else {
            text.innerHTML += String.fromCharCode(e.keyCode);
        }
        updateCursor()
    }
});

document.querySelector('body').addEventListener('keydown', async function (e) {
    if (e.keyCode == 8) {
        var cursor = document.querySelector('.cursor');
        var line = document.querySelector('.current');
        var text = line.querySelector('.text');
        var x = parseInt(cursor.getAttribute('x'));
        if (x != 0)
            cursor.setAttribute('x', x - 1);
        // delete character at x position in text
        if (x != 0)
            text.innerText = text.innerHTML.substring(0, x - 1) + text.innerHTML.substring(x);
        else if (text.innerText.length == 1)
            text.innerText = text.innerHTML.substring(1);

        updateCursor()
    } else if (e.keyCode == 46) {
        var cursor = document.querySelector('.cursor');
        var line = document.querySelector('.current');
        var text = line.querySelector('.text');
        var x = parseInt(cursor.getAttribute('x'));
        // delete character at x position in text
        text.innerText = text.innerHTML.substring(0, x) + text.innerHTML.substring(x + 1);
        updateCursor()
    } else if (e.keyCode == 37) {
        var cursor = document.querySelector('.cursor');
        var x = parseInt(cursor.getAttribute('x'));
        if (x > 0) {
            cursor.setAttribute('x', x - 1);
        }
        updateCursor()
    } else if (e.keyCode == 39) {
        var cursor = document.querySelector('.cursor');
        // get text of current line
        var text = document.querySelector('.current').querySelector('.text');
        var x = parseInt(cursor.getAttribute('x'));
        if (x < text.innerText.length) {
            cursor.setAttribute('x', x + 1);
        }
        updateCursor()
    } else if (e.ctrlKey && e.keyCode == 67) {
        location.reload();
    } else if (e.ctrlKey && e.keyCode == 86) {
        const text = await navigator.clipboard.readText();
        // paste text at cursor position and move cursore to the end of pasted text
        const cursor = document.querySelector('.cursor');
        const line = document.querySelector('.current');
        const textNode = line.querySelector('.text');
        const x = parseInt(cursor.getAttribute('x'));
        textNode.innerText = textNode.innerHTML.substring(0, x) + text + textNode.innerHTML.substring(x);
        cursor.setAttribute('x', x + text.length);

        updateCursor()
    }

});

document.querySelector(".phoneswitch").addEventListener("click", (a) => {
    var command = prompt("Enter command, use 'help' to see all commands");
    document.querySelector('.current').querySelector('.text').innerText = command;

    var line = document.querySelector('.current');
    var cursor = document.querySelector('.cursor');
    matchCommand()
    line.removeChild(cursor);
    // clone line element
    var newLine = line.cloneNode(true);
    // remove current class
    line.classList.remove('current');
    // remove cursor node from line
    // clear text from newLine
    newLine.querySelector('.text').innerHTML = '';
    // append line to container
    document.querySelector('.container').appendChild(newLine);
    cursor.setAttribute('x', 0);
    newLine.appendChild(cursor);
    updateCursor()
    updateDir()
    window.scrollTo(0, document.body.scrollHeight);
});

function updateCursor() {
    var cursor = document.querySelector('.cursor');
    var x = parseInt(cursor.getAttribute('x'));
    var line = document.querySelector('.current');
    var text = line.querySelector('.text');
    var textWidth = text.getBoundingClientRect().width;
    var textLeft = text.getBoundingClientRect().left;
    var cursorLeft = textLeft + x * textWidth / text.innerText.length;
    cursor.style.left = cursorLeft + 'px';

    if (x == 0) {
        cursor.style.left = textLeft - 1 + 'px';
    }
}

async function matchCommand() {
    // get latest text text
    var text = document.querySelector('.current').querySelector('.text').innerText;
    // split text into array of words spaces
    var args = text.split(' ');
    // get first word
    var command = args[0];

    var output = null;

    // loop through commands
    for (var i = 0; i < commands.length; i++) {
        var result = commands[i].execute(args);
        if (result) {
            // break out of loop
            output = result;
            break;
        }
    }
    var div = document.createElement('div');
    div.style.color = 'white';

    // check if output is promise
    if (output instanceof Promise) {
        var asd;
        await output.then(function (result) {
            asd = result;
        });
        output = asd;
    }
    if (!output) {
        output = "Invalid command, use 'help' to see all commands";
        div.style.color = 'red';
    }

    if (output.indexOf("!") == 0) {
        output = output.substring(1);
        div.style.color = 'red';
    }
    div.innerText = output;
    document.querySelector('.container').appendChild(div);
}

function updateDir() {
    var current = document.querySelector('.current');
    var dir = current.querySelector('.dir');
    dir.innerText = directory.getPath() + "> ";
}

document.getElementById("switch").addEventListener("click", function () {
    if (!phone)
        window.location.href="/#phone"
    else
        window.location.href="/#"
    // reload page
    window.location.reload();
});

setInterval(updateCursor, 500);
