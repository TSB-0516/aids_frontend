async function fetchPreviousLeaderboard() {
    try {
        const response = await fetch('https://aidsbackend.onrender.com/affiliate/leaderboard/previous');
        const data = await response.json();

        // Debug log
        console.log('Fetched previous data:', data);

        if (data && data.length > 0) {
            const lastWeekData = data[0]; // Get the most recent archived leaderboard

            // Add timestamp display if needed
            const archiveDate = new Date(lastWeekData.archivedAt).toLocaleDateString();
            if (document.getElementById('archive-date')) {
                document.getElementById('archive-date').textContent = `Archived on: ${archiveDate}`;
            }

            if (lastWeekData.leaderboard && lastWeekData.leaderboard.length > 0) {
                // Display top 3 users
                displayTop3(lastWeekData.leaderboard.slice(0, 3));

                // Display positions 4+
                displayRemainingUsers(lastWeekData.leaderboard.slice(3));
            } else {
                console.error('No previous leaderboard data found');
                showToast('No previous leaderboard data available');
            }
        }

    } catch (error) {
        console.error('Error fetching previous leaderboard:', error);
        showToast('Error loading previous leaderboard data');
    }
}

function displayTop3(top3Users) {
    console.log('Displaying top 3:', top3Users);
    const topPositions = document.querySelectorAll('.css-gqrafh .css-jehefp, .css-gqrafh .css-oijls1');
    console.log('Found top positions:', topPositions.length);

    // Define the order of positions (2nd, 1st, 3rd)
    const positionOrder = [1, 0, 2];

    positionOrder.forEach((userIndex, positionIndex) => {
        const user = top3Users[userIndex];
        if (user && topPositions[positionIndex]) {
            const position = topPositions[positionIndex];
            try {
                // Update avatar
                position.querySelector('.css-1wgwpc8').src = user.user.avatar;

                // Update username
                position.querySelector('.css-15a1lq3').textContent = user.user.username;

                // Update wagered amount (convert from cents to dollars)
                position.querySelector('.css-114dvlx').textContent = (user.wager / 100).toFixed(2);
            } catch (error) {
                console.error('Error updating position', positionIndex, error);
                console.error('User data:', user);
                console.error('Position element:', position);
            }
        }
    });
}

function displayRemainingUsers(users) {
    const listContainer = document.querySelector('.css-esk2ah');

    if (!listContainer) {
        console.error('List container not found');
        return;
    }

    // Remove existing list items after the details row
    const existingRows = document.querySelectorAll('.row.list.row-cols-5');
    existingRows.forEach(row => {
        if (!row.classList.contains('details')) {
            row.remove();
        }
    });

    // Create new list items (positions 4+)
    users.forEach((user, index) => {
        const position = index + 4;
        const row = document.createElement('div');
        row.className = 'row list row-cols-5';
        row.setAttribute('data-v-1d580398', '');
        row.innerHTML = `
            <div data-v-1d580398="" class="hide-mobile col-2"><b data-v-1d580398="">#</b>${position}</div>
            <div data-v-1d580398="" class="col-5">
                <img data-v-1d580398="" src="${user.user.avatar}">
                <span data-v-1d580398="">${user.user.username}</span>
            </div>
            <div data-v-1d580398="" class="col-2">
                <div data-v-1d580398="" class="price-wrapper">
                    ${getPrize(position)}
                </div>
            </div>
            <div data-v-1d580398="" class="col-3">
                <div data-v-1d580398="" class="price-wrapper" style="color: #eee">
                    <div class="price-image-wrapper" style="height: 0rem; width: 0rem; margin-right: 0px;"></div>
                    ${(user.wager / 100).toFixed(2)}
                </div>
            </div>
        `;
        listContainer.appendChild(row);
    });
}

function getPrize(position) {
    const prizes = {
        1: '$ 150',
        2: '$ 75',
        3: '$ 40',
        4: '$ 25',
        5: '$ 10'
    };
    return prizes[position] || '';
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchPreviousLeaderboard();
});
