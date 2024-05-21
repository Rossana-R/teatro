
const messageSection = window.document.getElementById(`section-messages`);
const dateSection = window.document.getElementById(`event-section-date`);
const dataSection = window.document.getElementById(`event-section-data`);
dataSection.classList.add(`hidden`);

dateSection.addEventListener(`submit`, (e) => {
    e.preventDefault();

    const ExecuteRequets = async () => {
        const start = window.document.getElementById(`input-datetime-start`);
        const end = window.document.getElementById(`input-datetime-end`);

        if(!start.value) return start.classList.add(`border-red-400`);
        start.classList.remove(`border-red-400`);

        if(!end.value) return end.classList.add(`border-red-400`);
        end.classList.remove(`border-red-400`);

        const RequetsOptions = { method: `POST` }
        const URL = `/public/register/event?test=DATE&start=${start.value}&end=${end.value}`;
        const result = await fetch(URL, RequetsOptions);
        const jsonPromise = result.json();

        if(!result.ok) {
            alert(`error`);
            return;
        }
        const json = await jsonPromise;
        if (json.body.lenght == 0) return messageSection.textContent = `el teatro está ocupado.`;

        document.getElementById(`datetime_start`).value = start.value.split(`T`)[1]
        document.getElementById(`datetime_end`).value = end.value.split(`T`)[1]
        document.getElementById(`datetime`).value = start.value.split(`T`)[0]

        messageSection.textContent =`puedes crear el evento.`;
        dateSection.classList.add(`hidden`);
        dataSection.classList.remove(`hidden`);
        dataSection.classList.add(`block`);
        window.localStorage.setItem(`date`, JSON.stringify({start:start.value,end:end.value}));
        return;
    }
    ExecuteRequets();

})
