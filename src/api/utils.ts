function storeData(key: string, data: any): void
{
    localStorage.setItem(key, JSON.stringify(data))
}

function loadData<U>(key: string): U
{
    let r = localStorage.getItem(key)
    if(!r) throw new Error(`Key ${key} not found in localStorage`)
    return JSON.parse(r)
}

export {
    storeData,
    loadData
}