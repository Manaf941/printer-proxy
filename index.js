import * as net from "net"

const ip = ""
const port = 3000

const server = net.createServer((socket) => {
    const queue = []
    const queueListener = (data) => {
        queue.push(data)
    }
    socket.on("data", queueListener)
    const newSocket = net.connect(port, ip, () => {
        socket.removeListener("data", queueListener)
        socket.on("data", (data) => {
            console.log(`\x1b[32m->/x1b[0m${data.toString()}`)
            newSocket.write(data)
        })
        queue.forEach((data) => {
            console.log(`\x1b[32m->/x1b[0m${data.toString()}`)
            newSocket.write(data)
        })

        newSocket.on("data", (data) => {
            console.log(`\x1b[32m<-/x1b[0m${data.toString()}`)
            socket.write(data)
        })
        socket.on("close", () => {
            newSocket.end()
        })
        newSocket.on("close", () => {
            socket.end()
        })
    })
})

server.listen(port)