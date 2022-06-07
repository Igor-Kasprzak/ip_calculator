const MASKS: string[] = [
    '255.0.0.0',
    '255.128.0.0',
    '255.192.0.0',
    '255.224.0.0',
    '255.240.0.0',
    '255.248.0.0',
    '255.252.0.0',
    '255.254.0.0',
    '255.255.0.0',
    '255.255.128.0',
    '255.255.192.0',
    '255.255.224.0',
    '255.255.240.0',
    '255.255.248.0',
    '255.255.252.0',
    '255.255.254.0',
    '255.255.255.0',
    '255.255.255.128',
    '255.255.255.192',
    '255.255.255.224',
    '255.255.255.240',
    '255.255.255.248',
    '255.255.255.252',
    '255.255.255.254',
    '255.255.255.255'
];

const init = (): void => {
    clearOutPut();
    updateClass();
};

const clearOutPut = (): void => {
    document.getElementById('outputBase').innerHTML = '&#160;';
    document.getElementById('outputFirst').innerHTML = '&#160;';
    document.getElementById('outputLast').innerHTML = '&#160;';
    document.getElementById('outputBroadcast').innerHTML = '&#160;';
};

const showOutput = (): void => {
    clearOutPut();
    const addressIp: string = (<HTMLInputElement>document.querySelector('input[name="addressIp"]')).value;
    if (addressIp.match(/^((25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(25[0-5]|2[0-4]\d|[01]?\d?\d)$/) == null) {
        alert("Wprowadzono błędny adres IP.");
        return;
    }

    const maskIp: string = (<HTMLInputElement>document.querySelector('select[name="maskIp"]')).value;

    const base: string = getBaseAddress(addressIp, maskIp);
    const broadcast: string = getBroadcastAddress(addressIp, maskIp);

    document.getElementById('outputBase').innerHTML = base;
    document.getElementById('outputFirst').innerHTML = getFirstHost(base);
    document.getElementById('outputLast').innerHTML = getLastHost(broadcast);
    document.getElementById('outputBroadcast').innerHTML = broadcast;
};

const getBaseAddress = (addressIp: string, maskIp: string): string => {
    const adressArray: string[] = addressIp.split('.');
    const classArray: string[] = maskIp.split('.');
    let resultArray: number[] = [];
    adressArray.forEach((adressSegment: string, idxAdressSegment: number) => {
        resultArray[idxAdressSegment] = parseInt(adressSegment, 10) & parseInt(classArray[idxAdressSegment], 10);
    });
    return resultArray.join('.');
};

const getBroadcastAddress = (addressIp: string, maskIp: string): string => {
    const adressArray: string[] = addressIp.split('.');
    const classArray: string[] = maskIp.split('.');
    let resultArray: number[] = [];
    classArray.forEach((classSegment: string, idxClassSegment: number) => {
        resultArray[idxClassSegment] = parseInt(adressArray[idxClassSegment], 10) & parseInt(classSegment, 10);
        resultArray[idxClassSegment] += Math.abs(parseInt(classSegment, 10) - 255);
    });
    return resultArray.join('.');
};

const getFirstHost = (baseAddress: string): string => {
    let resultArray: string[] = baseAddress.split('.');
    resultArray[3] = (parseInt(resultArray[3], 10) + 1).toString(10);
    return resultArray.join('.');
};

const getLastHost = (broadcastAddress: string): string => {
    let resultArray: string[] = broadcastAddress.split('.');
    resultArray[3] = (parseInt(resultArray[3], 10) - 1).toString(10);
    return resultArray.join('.');
};

const updateClass = (): void => {
    clearOutPut();
    const maskIp: number = parseInt((<HTMLInputElement>document.querySelector('input[name="classIp"]:checked')).value, 10);
    const select: HTMLSelectElement = document.querySelector('select[name="maskIp"]');
    select.options.length = 0;
    let option: HTMLOptionElement;
    for (let i: number = maskIp; i < MASKS.length; i++) {
        option = document.createElement('option');
        option.value = MASKS[i];
        option.text = MASKS[i];
        select.options.add(option);
    }
};