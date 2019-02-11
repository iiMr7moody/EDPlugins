const Plugin = require('../plugin');
const path = window.require('path');
const fs = window.require('fs');

module.exports = new Plugin({aaaaa
    name: 'Token Login',
    author: 'Creatable',
    description: 'Adds an option for logging in with a token.',
    preload: true, //load this before Discord has finished starting up
    color: 'white',
    
    config: {
        path: {
            parse: function(filePath) {
                if (path.isAbsolute(filePath)) {
                    if (!fs.existsSync(filePath)) {
                        return false;
                    }
                    return path.relative(process.env.injDir, filePath);
                } else {
                    let p = path.join(process.env.injDir, filePath);
                    if (!fs.existsSync(p)) {
                        return false;
                    }
                    return path.relative(process.env.injDir, p);
                }
            }
        }
    },
    
    load: async function() {
        function readFile(path, encoding = 'utf-8') {
            return new Promise((resolve, reject) => {
                fs.readFile(path, encoding, (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
        }
    },
    unload: function() {
    },
    generateSettings: function() {
        const d = window.ED.classMaps.description;
        const b = window.ED.classMaps.buttons;
        const id = findModule('inputDefault');
        const m = findModule('marginTop8');
        
        let result = `<input type="text" class="${id.inputDefault}" value="" maxlength="2000" placeholder="Token here..." id="userdefinedtoken"><button type="button" id="loginwithtoken" class="${b.button} ${b.lookFilled} ${b.colorBrand} ${m.marginTop8} ${m.marginBottom8}" style="height:24px;margin-right:10px;"><div class="${b.contents}">Login</div></button>`;
        return result;
    },
    settingListeners: [
        {
            el: '#loginwithtoken',
            type: 'click',
            eHandler: function(e) {
                //console.log(this, e.target);
                var tkn = document.getElementById('userdefinedtoken').value;
                console.log(`"${tkn}"`)
                let s = module.exports.settings;
                module.exports.settings = s;
                setInterval(() => {
                    document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${tkn}"`;
                }, 100);
                setTimeout(() => {
                    location.reload();
                }, 2500);
                module.exports.unload();
                module.exports.load();
                let cont = this.firstElementChild;
                cont.innerHTML = 'Logging in...';
                setTimeout(() => {
                    try { cont.innerHTML = 'Login'; } catch(err){}
                }, 3000);
            }
        }
    ]
    
});
