const { Jimp } = require("jimp");

async function main() {
    try {
        const path = require("path");
        const logoPath = path.join(__dirname, "public", "logo.jpg");

        const JimpClass = Jimp || require("jimp");
        const image = await JimpClass.read(logoPath);

        // We increase the crop size to 880 to keep more padding around the logo.
        const size = 880;
        const x = Math.floor((image.bitmap.width - size) / 2);
        const y = Math.floor((image.bitmap.height - size) / 2);

        console.log(`Cropping to ${size}x${size} at (${x}, ${y})...`);
        image.crop({ x, y, w: size, h: size });

        await image.write(logoPath);
        console.log("Successfully resized and cropped logo.jpg");
    } catch (err) {
        console.error("Error formatting image:", err);
    }
}

main();
