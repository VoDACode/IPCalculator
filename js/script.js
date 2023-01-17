let inputMaskNumber = document.getElementById('input-mask-number');

function getInputPart(num) {
    return document.getElementById(`input-part-${num}`);
}

function init(){
    calc();
}

init();

function calc(){
    if(arguments[0] !== 'mask'){
        calcMask({target: inputMaskNumber});
    }
    calcNetworkAddress();
    calcNodeNumber();
    calcMaxNodeNumber();
}

for (let i = 0; i < 4; i++) {
    const inputPart = getInputPart(i);
    inputPart.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            if (e.target.selectionStart === e.target.value.length && i < 3) {
                getInputPart(i + 1).focus();
                getInputPart(i + 1).selectionStart = getInputPart(i + 1).selectionEnd = 1;
            }
        } else if (e.key === 'ArrowLeft') {
            if (e.target.selectionStart === 0 && i > 0) {
                getInputPart(i - 1).focus();
                getInputPart(i - 1).selectionStart = getInputPart(i - 1).selectionEnd = getInputPart(i - 1).value?.length || 0;
            }
        } else if (e.key === 'Backspace') {
            if (e.target.selectionStart === 0 && e.target.selectionEnd === 0 && i > 0) {
                getInputPart(i - 1).focus();
                getInputPart(i - 1).selectionStart = getInputPart(i - 1).selectionEnd = getInputPart(i - 1).value?.length || 0;
            }
        }
    });
    inputPart.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(' ', '');
        let value = e.target.value;

        if (isNaN(Number(value)) || value.length > 3) {
            e.target.value = e.target.oldValue || '';
        } else {
            if (Number(value) > 255 || Number(value) < 0 || value.length === 0) {
                setValidIp(false, i);
            } else {
                setValidIp(true, i);
                calc();
            }
            e.target.oldValue = value;
        }

        if (value.length === 3) {
            if (i < 3) {
                getInputPart(i + 1).focus();
            }
        }
        if (e.target.selectionStart === 0 && e.target.selectionEnd === 0 && i > 0) {
            getInputPart(i - 1).focus();
            getInputPart(i - 1).selectionStart = getInputPart(i - 1).selectionEnd = getInputPart(i - 1).value.length || 0;
        }
    });
}

inputMaskNumber.addEventListener('input', calcMask);

function calcMask(e){
    let value = e.target.value;

    if (isNaN(Number(value)) || value.length > 3) {
        e.target.value = e.target.oldValue || '';
    } else {
        if (Number(value) > 32 || Number(value) < 0 || value.length === 0) {
            inputMaskNumber.classList.add('invalid');
        } 
        inputMaskNumber.classList.remove('invalid');
        let mask = getBinaryMask(value);
        document.getElementById('binary-mask').innerText = mask;
        let tmp = '';
        for(let i = 0, k = 0; i < document.getElementById('binary-mask').innerText.length; i++) {
            k++;
            tmp += document.getElementById('binary-mask').innerText[i];
            if (k === 8 && i < document.getElementById('binary-mask').innerText.length - 1) {
                tmp += '.';
                k = 0;
            }
        }
        document.getElementById('binary-mask').innerText = tmp;
        document.getElementById('mask').innerText = binaryToMask10(mask);
        e.target.oldValue = value;
        calc('mask');
    }
}

function calcNetworkAddress(){
    let ip = getIp().split('.');
    let mask = binaryToMask10(getBinaryMask(inputMaskNumber.value)).split('.');
    let networkAddress = '';

    for (let i = 0; i < 4; i++) {
        networkAddress += ip[i] & mask[i];
        if (i < 3) {
            networkAddress += '.';
        }
    }
    document.getElementById('network-address').innerText = networkAddress;
}

function calcMaxNodeNumber(){
    let mask = binaryToMask10(getBinaryMask(inputMaskNumber.value)).split('.');
    let nodeNumber = 0;
    for (let i = 0; i < 4; i++) {
        nodeNumber += 255 - mask[i];
        if (i < 3) {
            nodeNumber *= 256;
        }
    }
    document.getElementById('max-node-number').innerText = nodeNumber;
}

function calcNodeNumber(){
    let count = 0;
    let nodeNumber = '';
    let ip = getBinaryIp();
    let mask = getBinaryMask(inputMaskNumber.value);

    for(let i = 0; i < 32; i++){
        if(mask[i] === '0'){
            count++;
        }
    }

    ip = ip.split('').reverse().join('');

    for(let i = 0; i < count; i++){
        nodeNumber += ip[i];
    }
    nodeNumber = nodeNumber.split('').reverse().join('');

    nodeNumber = parseInt(nodeNumber, 2);
    document.getElementById('node-number').innerText = nodeNumber;
}

function setValidIp(valid, num) {
    if (num === undefined) {
        for (let i = 0; i < 4; i++) {
            getInputPart(i).classList.add(valid ? 'valid' : 'invalid');
            getInputPart(i).classList.remove(valid ? 'invalid' : 'valid');
        }
    } else {
        getInputPart(num).classList.add(valid ? 'valid' : 'invalid');
        getInputPart(num).classList.remove(valid ? 'invalid' : 'valid');
    }
}

function getIp() {
    let ip = '';
    for (let i = 0; i < 4; i++) {
        ip += getInputPart(i).value || '0';
        if (i < 3) {
            ip += '.';
        }
    }
    return ip;
}

function binaryToMask10(binary) {
    let mask = '';
    for (let i = 0; i < 4; i++) {
        mask += parseInt(binary.substr(i * 8, 8), 2);
        if (i < 3) {
            mask += '.';
        }
    }
    return mask;
}
    

function getBinaryMask(mask) {
    let binary = '';
    for (let i = 0; i < mask; i++) {
        binary += '1';
    }
    while (binary.length < 32) {
        binary += '0';
    }
    return binary;
}

function getBinaryIp() {
    let ip = getIp().split('.');
    let binaryIp = '';
    for (let i = 0; i < 4; i++) {
        let tmp = Number(ip[i]).toString(2);
        while (tmp.length < 8) {
            tmp = '0' + tmp;
        }
        binaryIp += tmp;
    }
    return binaryIp;
}