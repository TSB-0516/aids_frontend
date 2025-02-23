
document.addEventListener("DOMContentLoaded", () => {
    fetchLeaderboard();
    setInterval(fetchLeaderboard, 60000); // Refresh every minute
});

async function fetchLeaderboard() {
    try {
        const response = await fetch('https://aidsgamble.onrender.com/previous-leaderboard');
        const data = await response.json();

        console.log('Fetched data:', data);

        if (data.error) {
            console.error('Error:', data.error);
            return;
        }




        // Update leaderboard if data exists
        if (data && data.summarizedBets && Array.isArray(data.summarizedBets)) {
            // Sort by wager in descending order (convert wager to number for sorting)
            const sortedUsers = data.summarizedBets.sort((a, b) => parseFloat(b.wager) - parseFloat(a.wager));

            // Update top 3 positions
            updateTop3(sortedUsers.slice(0, 3));

            // Update remaining positions (4-10)
            updateRemainingPositions(sortedUsers.slice(3, 10));
        } else {
            showEmptyState('No leaderboard data available');
        }

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        showToast('Error loading leaderboard data');
    }
}



function updateTop3(top3Users) {
    const positions = document.querySelectorAll('.css-gqrafh .css-jehefp, .css-gqrafh .css-oijls1');
    const positionOrder = [1, 0, 2]; // 2nd, 1st, 3rd in DOM order

    positionOrder.forEach((positionIndex, i) => {
        const user = top3Users[i];
        if (user && positions[positionIndex]) {
            const position = positions[positionIndex];
            try {
                position.querySelector('img').src = user.user.avatar;
                position.querySelector('.css-15a1lq3').textContent = user.user.displayName || user.user.username;
                position.querySelector('.css-114dvlx').textContent = parseFloat(user.wager).toFixed(2);
            } catch (error) {
                console.error('Error updating position', positionIndex, error);
            }
        } else {
            // Clear the position if no user data
            try {
                const position = positions[positionIndex];
                position.querySelector('img').src = '';
                position.querySelector('.css-15a1lq3').textContent = '';
                position.querySelector('.css-114dvlx').textContent = '0.00';
            } catch (error) {
                console.error('Error clearing position', positionIndex, error);
            }
        }
    });
}

function updateRemainingPositions(users) {
    const listContainer = document.querySelector('.list-container');
    listContainer.innerHTML = '';

    users.forEach((user, index) => {
        const position = index + 4;
        const row = document.createElement('div');
        row.className = 'row list row-cols-5';
        row.style.cssText = `
            border: 1px solid rgb(37, 99, 235);
            border-radius: 4px;
            background: rgba(13, 18, 27, 0.75);
            margin-bottom: 8px;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 48px;
        `;

        row.innerHTML = `
            <div class="hide-mobile col-2" style="color: rgb(37, 99, 235); flex: 0 0 10%; padding-left: 0px;">
                <b>#</b>${position}
            </div>
            <div class="col-5" style="color: #fff; font-size: 16px; flex: 0 0 40%; padding-left: -10px; margin-left: -20px;">
                ${user.user.displayName || user.user.username}
            </div>
            <div class="col-3" style="color: #fff; font-size: 16px; flex: 0 0 30%; text-align: right; padding-right: 40px;">
                ${parseFloat(user.wager).toFixed(2)}
            </div>
            <div class="col-2" style="text-align: right; flex: 0 0 20%;">
                <div class="price-wrapper" style="color: rgb(37, 99, 235);">
                    ${getPrize(position)}
                </div>
            </div>
        `;
        listContainer.appendChild(row);
    });
}

function getPrize(position) {
    const prizes = {
        4: '$ 25',
        5: '$ 10'
    };
    return prizes[position] || '';
}

function showEmptyState(message) {
    const listContainer = document.querySelector('.list-container');
    if (listContainer) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #fff;">
                <p>${message}</p>
            </div>
        `;
    }

    // Clear top 3 positions
    const topPositions = document.querySelectorAll('.css-gqrafh .css-jehefp, .css-gqrafh .css-oijls1');
    topPositions.forEach(position => {
        try {
            position.querySelector('img').src = '';
            position.querySelector('.css-15a1lq3').textContent = '';
            position.querySelector('.css-114dvlx').textContent = '0.00';
        } catch (error) {
            console.error('Error clearing position:', error);
        }
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        const messageElement = toast.querySelector('#message');
        if (messageElement) {
            messageElement.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }
}
