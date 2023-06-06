import { emptyDir, ensureDir } from "https://deno.land/std@0.149.0/fs/mod.ts";
import * as esbuild from 'https://deno.land/x/esbuild@v0.14.50/mod.js'

async function createFolderStructure() {
    await ensureDir("./dist");
    await emptyDir("./dist");
    await emptyDir("./dist/classes");
    await emptyDir("./dist/events");

    await emptyDir("./dist/expressions");
    await emptyDir("./dist/expressions/code-factories");

    await emptyDir("./dist/idle");
    await emptyDir("./dist/managers");
    await emptyDir("./dist/parsers");

    await emptyDir("./dist/providers");
    await emptyDir("./dist/providers/attributes");
    await emptyDir("./dist/providers/attributes/utils");
    await emptyDir("./dist/providers/element");
    await emptyDir("./dist/providers/events");
    await emptyDir("./dist/providers/properties");
    await emptyDir("./dist/providers/properties/utils");
    await emptyDir("./dist/providers/text");

    await emptyDir("./dist/proxies");
    await emptyDir("./dist/store");
    await emptyDir("./dist/utils");

}

async function packageDirectory(def, loader, format, minified) {
    for (const dir of def.dir) {
        for await (const dirEntry of Deno.readDir(dir)) {
            if (dirEntry.isDirectory) {
                continue;
            }

            const sourceFile = `${dir}/${dirEntry.name}`;

            let targetFile = `${def.target}${dir}/${dirEntry.name}`;
            let keys = Object.keys(def.replace || {});
            for (const key of keys) {
                targetFile = targetFile.replace(key, def.replace[key]);
            }

            await packageFile(sourceFile, targetFile, loader, format, minified);
        }
    }
}

async function packageFiles(def, loader, format, minified) {
    for (const file of def.files) {
        const target = file.replace("./src", "./dist");
        await packageFile(file, target, loader, format, minified);
    }
}

async function packageFile(sourceFile, targetFile, loader, format, minified) {
    const src = await Deno.readTextFile(sourceFile);
    const result = await esbuild.transform(src, { loader: loader, minify: minified, format: format });
    await Deno.writeTextFile(targetFile, result.code);
}

async function bundle(file, output, minify = true) {
    const result = await esbuild.build({
        entryPoints: [file],
        bundle: true,
        outfile: output,
        format: "esm",
        minify: minify
    })

    console.log(result);
}

export async function copyDirectory(source, target) {
    await ensureDir(target);

    for await (const dirEntry of Deno.readDir(source)) {
        if (dirEntry.isDirectory == true) {
            await ensureDir(`${target}/${dirEntry.name}`);
            await copyDirectory(`${source}/${dirEntry.name}`, `${target}/${dirEntry.name}`);
            continue;
        }

        await Deno.copyFile(`${source}/${dirEntry.name}`, `${target}/${dirEntry.name}`);
    }
}

await createFolderStructure();

const minified = true;

await packageDirectory({
    dir: [
        "./src",
        "./src/classes",
        "./src/events",
        "./src/expressions",
        "./src/expressions/code-factories",
        "./src/idle",
        "./src/managers",
        "./src/parsers",
        "./src/providers",
        "./src/providers/attributes",
        "./src/providers/attributes/utils",
        "./src/providers/element",
        "./src/providers/events",
        "./src/providers/properties",
        "./src/providers/properties/utils",
        "./src/providers/text",
        "./src/proxies",
        "./src/store",
        "./src/utils"
    ],
    replace: {
        "./src": ""
    },
    target: "./dist"
}, "js", "esm", minified);

await bundle("./src/crs-binding.js", "./dist/crs-binding.js", minified);

Deno.exit(0);
