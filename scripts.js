let segments = [];
let spinning = false;
let spinInterval;
let rotationDegree = 0;

function updateWheel() {
    const names = segments.map(segment => segment.text);
    const wheel = document.getElementById('wheel');
    wheel.innerHTML = '<div class="center">Girar</div>';

    names.forEach((name, index) => {
        const segmentDiv = document.createElement('div');
        segmentDiv.classList.add('segment');
        segmentDiv.style.backgroundColor = `hsl(${(index * 360 / names.length)}, 100%, 50%)`;
        segmentDiv.style.transform = `rotate(${index * (360 / names.length)}deg)`;
        segmentDiv.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%)';
        segmentDiv.style.width = '50%';
        segmentDiv.style.height = '50%';
        segmentDiv.style.position = 'absolute';
        segmentDiv.style.transformOrigin = '100% 100%';

        const textSpan = document.createElement('span');
        textSpan.textContent = name;
        textSpan.style.display = 'none'; 
        segmentDiv.appendChild(textSpan);

        wheel.appendChild(segmentDiv);
    });
}

function generateParticipants() {
    const input = document.getElementById('nameInput').value.trim();
    if (!isNaN(input) && input !== '') {
        const count = parseInt(input);
        if (count > 0) {
            const names = [];
            for (let i = 1; i <= count; i++) {
                names.push(`Participante ${i}`);
            }
            segments = names.map(name => ({ text: name }));
        }
    } else {
        segments = input.split(/[\n,]+/).map(name => name.trim()).filter(name => name !== '').map(name => ({ text: name }));
    }
    updateWheel(); 
}

function toggleSpin() {
    const wheel = document.getElementById('wheel');

    if (!spinning) {
        spinning = true;
        const checkbox = document.getElementById('musicCheckbox');
        const audio = document.getElementById('audio');

        if (checkbox.checked && segments.length > 0) {
            audio.play();
        }

        spinInterval = setInterval(() => {
            rotationDegree += 20; 
            wheel.style.transform = `rotate(${rotationDegree}deg)`;
        }, 30);

    } else {
        clearInterval(spinInterval);
        spinning = false;

        wheel.style.transform = `rotate(${rotationDegree}deg)`;

        const finalDegree = rotationDegree % 360;
        const selectedSegmentIndex = Math.floor((finalDegree / (360 / segments.length))) % segments.length;
        const selectedSegment = segments[selectedSegmentIndex].text;

        document.getElementById('selectedName').textContent = selectedSegment;
        document.getElementById('currentName').textContent = `Nombre Actual: ${selectedSegment}`;

        segments.splice(selectedSegmentIndex, 1);
        updateWheel(); 

        const checkbox = document.getElementById('musicCheckbox');
        const audio = document.getElementById('audio');
        if (checkbox.checked) {
            audio.pause(); 
            audio.currentTime = 0;
        }
    }
}
