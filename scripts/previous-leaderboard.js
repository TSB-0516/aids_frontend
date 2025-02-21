// Fetch and display leaderboard data
async function fetchLeaderboard() {
    try {
        const response = await fetch('https://aidsbackend.onrender.com/affiliate/leaderboard');
        const data = await response.json();

        // Debug log
        console.log('Fetched data:', data);

        // Start countdown using nextAffiliateUpdate
        if (data.nextAffiliateUpdate) {
            startCountdown(data.nextAffiliateUpdate);
        }

        // Check if leaderboard data exists
        if (data.leaderboard && data.leaderboard.length > 0) {
            // Display top 3 users
            displayTop3(data.leaderboard.slice(0, 3));

            // Display positions 4-10
            displayRemainingUsers(data.leaderboard.slice(3));
        } else {
            console.error('No leaderboard data found:', data);
        }

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        showToast('Error loading leaderboard data');
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
                position.querySelector('img').src = user.user.avatar;
                position.querySelector('.css-15a1lq3').textContent = user.user.username;
                position.querySelector('.css-114dvlx').textContent = (user.wager / 100).toFixed(2);
            } catch (error) {
                console.error('Error updating position', positionIndex, error);
            }
        }
    });
}

function displayRemainingUsers(users) {
    const listContainer = document.querySelector('.list-container');

    users.forEach((user, index) => {
        const position = index + 4; // Start from position 4
        const row = document.createElement('div');
        row.className = 'row list row-cols-5';

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

// Countdown timer
function startCountdown(endTimestamp) {
    const countdownElement = document.getElementById('countdown');

    function updateCountdown() {
        const now = Date.now();
        const timeLeft = endTimestamp - now;

        if (timeLeft <= 0) {
            countdownElement.textContent = 'Updating...';
            setTimeout(() => location.reload(), 2000);
            return;
        }

        // Calculate remaining time
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Format with leading zeros
        const formattedTime = `${days}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        countdownElement.textContent = formattedTime;
    }

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Auto-refresh data every minute
function startAutoRefresh() {
    setInterval(fetchLeaderboard, 60000); // Refresh every minute
}

// Add this function to handle previous leaderboard button click
async function fetchPreviousLeaderboard() {
    try {
        const response = await fetch('http://aidsbackend.onrender.com/affiliate/leaderboard');
        const data = await response.json();

        console.log('Previous leaderboard data:', data);

        if (data && data.leaderboard && data.leaderboard.length > 0) {
            // Display top 3 users
            displayTop3(data.leaderboard.slice(0, 3));

            // Display positions 4-10
            displayRemainingUsers(data.leaderboard.slice(3, 10));
        } else {
            console.error('No previous leaderboard data found:', data);
            showToast('No previous leaderboard data available');
        }

    } catch (error) {
        console.error('Error fetching previous leaderboard:', error);
        showToast('Error loading previous leaderboard data');
    }
}

// Add event listener for the previous leaderboard button
document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('#previousLeaderboardBtn'); // Update this selector to match your button
    if (prevButton) {
        prevButton.addEventListener('click', fetchPreviousLeaderboard);
    }

    // Initial load of current leaderboard
    fetchLeaderboard();
    startAutoRefresh();
}); 
