const glob = require('glob-all')
const sharp = require('sharp')

let target = (process.env.NODE_ENV == 'production') ? 'dist' : 'public',
    type = "mobile"

// kill target

const width = (type == "mobile") ? 1180 : 1180

let collate = function() {
    console.log(__dirname, `++++++++++++++++++++++++++++++++ Processing Image Resizing - ${type} +++++++++++++++++++++++++++++++++`)
    return new Promise((resolve, reject) => {
        glob([
            `${__dirname}/../_images/**/*.jpg` // include 
            ], (err, files) => {
            let filtered = files.filter(f => {
                return !f.includes('_lowres')
            })
            if(!err) resolve(filtered)
            else reject(err)
        })
    })
}
collate().then(files => {
    files.forEach(path => {
        let src = rewriteDestination(path),
            output = (type == "mobile") ? mobileOutputPath(src) : desktopOutputPath(src),
            mobileHero = (type == "mobile" && output.includes("--hero")),
            w = (!mobileHero) ? width : 2560

        if(type == "mobile") {
            sharp(path)
                .resize((mobileHero) ? ~~(w * .56) : w)
                .toFile(output, function(err, result) {
                    if(err) console.log(err)
                    // else console.log(result)
                })
        }
    })
}).catch(console.log)

function rewriteDestination(path) {
    let pathAsArray = path.split('/')
    // keeping resized images to _images
    // let i = pathAsArray.indexOf("_images")
    // pathAsArray[i] = target
    // pathAsArray.splice((i + 1), 0, 'images')
    return pathAsArray
}

function desktopOutputPath(ary) {
    return ary.join('/')
}
function mobileOutputPath(ary) {
    let file = '' + ary.pop()
    ary.splice(ary.length, -1, '_lowres') 
    ary.splice(ary.length, -1, file)
    return ary.join('/')
}