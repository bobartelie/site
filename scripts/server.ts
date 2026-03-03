import { watch } from 'fs'
import notFound from '../pages/404'
import { $ } from 'bun'
//await $`bun run build`

const clients: Bun.ServerWebSocket<undefined>[] = []

const HTMLPage = (content: string, status = 200) => new Response(/*html*/`
    ${content}
    <script>
    const socket = new WebSocket("ws://localhost:3000");
    socket.addEventListener("message", event => {
        window.location.reload()
    });
    </script>
`, {
    headers: {
        "Content-Type": "text/html;charset=utf-8"
    },
    status
})

watch(`pages`, {recursive: true}, async () => {
    //await $`bun run build`
    for (const client of clients) {
        client.send("reload")
    }
})   

watch(`public`, {recursive: true}, async () => {
    //await $`bun run build`
    for (const client of clients) {
        client.send("reload")
    }
})   


const server = Bun.serve({
    async fetch(req, server) {
        const path = new URL(req.url).pathname;
        server.upgrade(req);
        if (!path.includes('.')){
            const filename = `pages/${path}/index.page.ts`.replace('//', '/')
            const content = (await (import(`../${filename}`))).default.trim()
            if(content){
                return HTMLPage(content);
            }
        } else {
            const filename = `public/${path}`.replace('//', '/')
            const file = Bun.file(filename)
            if(await file.exists()){
                return new Response(file);
            }
        }
        return HTMLPage(notFound, 404);
    },
    websocket: {
        message(ws, message) {
            
        },
        open(ws: Bun.ServerWebSocket<undefined>){
            clients.push(ws)
        }
    }
})

console.log(`server runnin on ${server.url}`)