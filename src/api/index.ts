interface WebEventData {
    event: string
    data: any
}

interface WebUIMessage {
    event: string
    ok: boolean
    msg: string
    data: any
}

type CKPTkeys = 'status' | 'test_metrics' | 'hyperparams' | 'train_params' | 'control_params' | 'dataset'
type CKPTStatic = Record<CKPTkeys, Record<string, string | number>>
type CKPTMaps  = Record<CKPTkeys, Record<number, number[]> | undefined>
type Metrics = Record<string, Record<string, number> | number>

class WebUIAPI {
    ui_socket: WebSocket
    listeners: { [key: string]: (data: any) => void }
    readyFuncs: (() => void)[]
    error_handles: { [key: string]: (ui_msg: WebUIMessage) => void }
    
    constructor() {
        this.ui_socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/board`)
        this.ui_socket.addEventListener('open', (ev) => {
            console.log('connected to web ui' + ev)
            for (let func of this.readyFuncs) func()
        })
        this.readyFuncs = []
        this.listeners = {}
        this.error_handles = {}
        this.ui_socket.addEventListener('message', (ev) => {
            try {
                let { event, ok, msg, data } = JSON.parse(ev.data) as WebUIMessage
                if(ok) {
                    let func = this.listeners[event]
                    if (func) func(data)
                } else {
                    let handle = this.error_handles[event]
                    if(handle) handle({ event, ok, msg, data })
                    else console.error('Error:', msg)
                }
            } catch(err) {
                console.error('Error:', err)
            }
        })
    }

    emit(event: string, data: any) {
        if (this.listeners[event] === undefined) console.warn(`event ${event} not registered \
                                                               but has been emitted`)
        this.ui_socket.send(JSON.stringify({
            event,
            data
        }))
    }

    addListener(event: string, callback: (data: any) => void, 
                err_handle: ((ui_msg: WebUIMessage)=>void) | undefined = undefined): void {
        if (this.listeners[event] !== undefined) {
            // already registered
            console.error(`event ${event} has been registered by function ${this.listeners[event]}`)
            return
        }
        this.listeners[event] = callback
        if(err_handle) this.error_handles[event] = err_handle
    }

    toggle(event: string, data: any, callback: (data: any) => void) {
        console.log('toggle', event)
        this.addListener(event, callback)
        this.emit(event, data)
    }

    onready(callback: () => void) {
        this.readyFuncs.push(callback)
    }
}

const webUiApi = new WebUIAPI()

export {
    webUiApi
}

export default webUiApi

export type {
    CKPTkeys,
    CKPTStatic,
    CKPTMaps,
    Metrics,
    WebEventData,
    WebUIMessage,
}