document.addEventListener("DOMContentLoaded", () => {
    fetchLeaderboard();
    setInterval(fetchLeaderboard, 60000);
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    fetchLeaderboard();
    setInterval(fetchLeaderboard, 60000); // Refresh every minute
  });
  
  async function fetchLeaderboard() {
    try {
      document.getElementById("loadingOverlay").classList.remove("hide");
      const response = await fetch("https://aidsgamble.onrender.com/leaderboard");
      const data = await response.json();
      document.getElementById("loadingOverlay").classList.add("hide");
  
      if (data.error) {
        console.error("Error:", data.error);
        return;
      }
  
      // Update countdown timer if it exists in the response
      if (data.countdownEndTime) {
        const countdownElement = document.getElementById("countdown");
        if (countdownElement) {
          const countdownTime = new Date(data.countdownEndTime);
          updateCountdown(countdownTime, countdownElement);
        }
      }
  
      // Update leaderboard if data exists
      if (data && data.summarizedBets && Array.isArray(data.summarizedBets)) {
        const sortedUsers = data.summarizedBets.sort(
          (a, b) => parseFloat(b.wager) - parseFloat(a.wager)
        );
        updateTop3(sortedUsers.slice(0, 3));
        updateRemainingPositions(sortedUsers.slice(3, 10));
      } else {
        showEmptyState("No leaderboard data available");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      showToast("Error loading leaderboard data");
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
          position.querySelector('img').src = user.user.avatar || 'default-avatar.png';
          position.querySelector('.css-15a1lq3').textContent = user.user.displayName || user.user.username;
          position.querySelector('.css-114dvlx').textContent = `$ ${parseFloat(user.wager).toFixed(2)}`;
        } catch (error) {
          console.error('Error updating position', positionIndex, error);
        }
      }
    });
  }
  
  function updateRemainingPositions(users) {
    const listContainer = document.querySelector(".list-container");
    listContainer.innerHTML = "";

    // Add header row
    const headerRow = document.createElement("div");
    headerRow.className = "row list row-cols-5";
    headerRow.style.cssText = `
        margin-bottom: 15px;
        padding: 0 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1600px;
        height: 60px;
        font-weight: bold;
        font-size: 24px;
        font-family: 'Orbitron', sans-serif;
        margin: 0 auto 15px auto;
    `;

    headerRow.innerHTML = `
        <div style="color: #fff; flex: 0 0 15%; display: flex; justify-content: center; align-items: center;">Place</div>
        <div style="color: #fff; flex: 0 0 40%; display: flex; justify-content: center; align-items: center;">User</div>
        <div style="color: #fff; flex: 0 0 25%; display: flex; justify-content: center; align-items: center;">Wager</div>
        <div style="color: #fff; flex: 0 0 20%; display: flex; justify-content: center; align-items: center;">Prize</div>
    `;
    listContainer.appendChild(headerRow);

    // Add player rows
    users.forEach((user, index) => {
        const position = index + 4;
        const row = document.createElement("div");
        row.className = "row list row-cols-5";
        row.style.cssText = `
            border: 1px solid rgb(37, 99, 235);
            border-radius: 8px;
            background: rgba(13, 18, 27, 0.75);
            margin-bottom: 15px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            max-width: 1600px;
            height: 60px;
            margin: 0 auto 15px auto;
        `;

        row.innerHTML = `
            <div class="leaderboard-col" style="color: rgb(37, 99, 235); flex: 0 0 15%; display: flex; justify-content: center; align-items: center; height: 100%; font-size: 18px;">#${position}</div>
            <div class="leaderboard-col" style="color: #fff; flex: 0 0 40%; display: flex; justify-content: center; align-items: center; height: 100%; font-size: 18px;">
                <div class="scrollable-name" style="overflow-x: auto; white-space: nowrap; max-width: 100%; scrollbar-width: none; -ms-overflow-style: none;">
                    ${user.user.displayName || user.user.username}
                </div>
            </div>
            <div class="leaderboard-col" style="color: #fff; flex: 0 0 25%; display: flex; justify-content: center; align-items: center; height: 100%; font-size: 18px;">${parseFloat(user.wager).toFixed(2)}</div>
            <div class="leaderboard-col" style="flex: 0 0 20%; display: flex; justify-content: center; align-items: center; height: 100%;">
                <div class="price-wrapper" style="color: rgb(37, 99, 235); font-size: 18px;">${getPrize(position)}</div>
            </div>
        `;

        listContainer.appendChild(row);
    });
  }
  
  function getPrize(position) {
    const prizes = {
      1: '$ 500',
      2: '$ 250',
      3: '$ 100',
      4: '$ 75',
      5: '$ 50',
      6: '$ 25'
    };
    return prizes[position] || '';
  }
  
  function showEmptyState(message) {
    const container = document.getElementById('leaderboard-entries');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #fff;">
          <p>${message}</p>
        </div>
      `;
    }
  }
  
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (toast) {
      const messageElement = toast.querySelector("#message");
      if (messageElement) {
        messageElement.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
      }
    }
  }
  
  function updateCountdown(countdownTime, countdownElement) {
    const updateTimer = () => {
      const now = new Date();
      const diff = countdownTime - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        countdownElement.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else {
        countdownElement.innerText = "Countdown Ended";
        clearInterval(timerInterval);
      }
    };

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial update
  }
  