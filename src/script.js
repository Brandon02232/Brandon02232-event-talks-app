document.addEventListener('DOMContentLoaded', () => {
    const scheduleElement = document.getElementById('schedule');
    const categorySearchInput = document.getElementById('category-search');

    function formatTime(date) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    function renderSchedule(filteredTalks = talks) {
        scheduleElement.innerHTML = '<h2>Event Schedule</h2>'; // Clear existing schedule

        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

        const eventSchedule = [];
        let talkIndex = 0;
        const totalTalks = filteredTalks.length;

        // Determine when to place the lunch break (after 3 talks)
        const lunchAfterTalk = 3;

        for (let i = 0; i < totalTalks + 1; i++) { // +1 for lunch break
            if (i === lunchAfterTalk && totalTalks > 0) {
                // Add lunch break
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60 * 1000);
                eventSchedule.push({
                    type: 'break',
                    title: 'Lunch Break',
                    startTime: formatTime(lunchStartTime),
                    endTime: formatTime(lunchEndTime),
                    duration: 60
                });
                currentTime = lunchEndTime;
            }

            if (talkIndex < totalTalks) {
                const talk = filteredTalks[talkIndex];
                const talkStartTime = new Date(currentTime);
                const talkEndTime = new Date(talkStartTime.getTime() + talk.duration * 60 * 1000);

                eventSchedule.push({
                    type: 'talk',
                    ...talk,
                    startTime: formatTime(talkStartTime),
                    endTime: formatTime(talkEndTime)
                });
                currentTime = talkEndTime;

                talkIndex++;

                // Add 10-minute transition, except after the last talk
                if (talkIndex < totalTalks || (i === lunchAfterTalk -1 && totalTalks > lunchAfterTalk)) { // if we are not at the end of the talks or just before lunch.
                    const transitionStartTime = new Date(currentTime);
                    const transitionEndTime = new Date(transitionStartTime.getTime() + 10 * 60 * 1000);
                    eventSchedule.push({
                        type: 'break',
                        title: 'Transition',
                        startTime: formatTime(transitionStartTime),
                        endTime: formatTime(transitionEndTime),
                        duration: 10
                    });
                    currentTime = transitionEndTime;
                }
            }
        }

        eventSchedule.forEach(item => {
            if (item.type === 'talk') {
                const talkDiv = document.createElement('div');
                talkDiv.classList.add('talk-block');
                talkDiv.innerHTML = `
                    <div class="talk-time">${item.startTime} - ${item.endTime}</div>
                    <div class="talk-content">
                        <h3 class="talk-title">${item.title}</h3>
                        <p class="talk-speakers">Speaker(s): ${item.speakers.join(', ')}</p>
                        <p class="talk-categories">Categories: ${item.category.join(', ')}</p>
                        <div class="talk-description">
                            <p>${item.description}</p>
                        </div>
                    </div>
                `;
                talkDiv.querySelector('.talk-title').addEventListener('click', () => {
                    talkDiv.classList.toggle('expanded');
                });
                scheduleElement.appendChild(talkDiv);
            } else if (item.type === 'break') {
                const breakDiv = document.createElement('div');
                breakDiv.classList.add('break-block');
                breakDiv.innerHTML = `
                    <div class="talk-time">${item.startTime} - ${item.endTime}</div>
                    <div class="break-content">${item.title} (${item.duration} min)</div>
                `;
                scheduleElement.appendChild(breakDiv);
            }
        });
    }

    categorySearchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        let filteredTalks = talks;
        if (searchTerm) {
            filteredTalks = talks.filter(talk =>
                talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
            );
        }
        renderSchedule(filteredTalks);
    });

    // Initial render
    renderSchedule();
});
