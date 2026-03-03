import { file, Glob } from "bun";
import { rmSync } from 'fs'

rmSync('_site', {recursive: true, force: true})

for (const page of new Glob("pages/**/index.ts").scanSync(".")) {
    const filename = page.replaceAll('\\', '/').replace('index.page.ts', 'index.html').replace(`pages/`, '')
    const content = (await (import(`../${page}`))).default.trim()
    Bun.write(`_site/${filename}`, content)
}

for (const path of new Glob("public/**/*").scanSync(".")) {
    const filename = path.replaceAll('\\', '/').replace('public/', '_site/')
    const file = Bun.file(path)
    Bun.write(filename, file)
}