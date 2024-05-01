interface WebEventData {
    event: string
    data: any
}


class WebUIAPI {
    ui_socket: WebSocket
    listeners: { [key: string]: (data: any) => void }
    
    constructor() {
        this.ui_socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/board`)
        this.ui_socket.addEventListener('open', (ev) => {
            console.log('connected to web ui' + ev)
        })
        this.listeners = {}
        this.ui_socket.addEventListener('message', (ev) => {
            let { event, data } = JSON.parse(ev.data) as WebEventData
            let func = this.listeners[event]
            if (func) func(data)
        })
    }

    emit(event: string, data: any) {
        this.ui_socket.send(JSON.stringify({
            event,
            data
        }))
    }

    addListener(event: string, callback: (data: any) => void): void {
        this.listeners[event] = callback
    }

    toggle(event: string, data: any, callback: (data: any) => void) {
        console.log('toggle', event)
        this.addListener(event, callback)
        this.emit(event, data)
    }
}


type CKPTkeys = 'status' | 'test_metrics' | 'hyperparams' | 'train_params' | 'control_params'
type CKPTStatic = Record<CKPTkeys, Record<string, any>>
type CKPTMaps  = Record<CKPTkeys, Record<number, number[]>>
type Metrics = Record<string, Record<string, number> | number>


const webUiApi = new WebUIAPI()

export {
    webUiApi
}

export type {
    CKPTkeys,
    CKPTStatic,
    CKPTMaps,
    Metrics
}