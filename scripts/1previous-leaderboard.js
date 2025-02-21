async function fetchPreviousLeaderboard() {
    try {
        const response = await fetch("https://localhost:8080/affiliate/previous-leaderboard");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.leaderboard || data.leaderboard.length === 0) {
            console.error("No previous leaderboard data found");
            showToast("No previous leaderboard data available");
            return;
        }

        // Sort leaderboard by wager (high to low)
        const leaderboardData = data.leaderboard.sort((a, b) => b.wager - a.wager);

        console.log("Sorted leaderboard data:", leaderboardData);

        displayTop3(leaderboardData.slice(0, 3)); // Top 3 users
        displayRemainingUsers(leaderboardData.slice(3)); // Positions 4-10

    } catch (error) {
        console.error("Error fetching previous leaderboard:", error);
        showToast("Error loading previous leaderboard data");
    }
}

function displayTop3(top3Users) {
    const positions = ["1st", "2nd", "3rd"];
    const topPositions = document.querySelectorAll(".css-gqrafh > div");
    const order = [1, 0, 2]; // Reorder for display: 2nd, 1st, 3rd

    order.forEach((orderIndex, displayIndex) => {
        const user = top3Users[orderIndex];
        if (user && topPositions[displayIndex]) {
            const position = topPositions[displayIndex];
            const img = position.querySelector("img");
            const username = position.querySelector(".css-15a1lq3");
            const wager = position.querySelector(".css-114dvlx");

            if (img) img.src = user.user.avatar;
            if (username) username.textContent = user.user.username;
            if (wager) wager.textContent = (user.wager / 100).toFixed(2);
        }
    });
}

function displayRemainingUsers(users) {
    const listContainer = document.querySelector(".css-esk2ah");

    // Remove any existing rows
    document.querySelectorAll(".row.list.row-cols-5:not(.details)").forEach(row => row.remove());

    // Create new list items (positions 4-10)
    users.forEach((user, index) => {
        const position = index + 4;
        if (position > 10) return;

        const row = document.createElement("div");
        row.setAttribute("data-v-1d580398", "");
        row.className = "row list row-cols-5";
        row.innerHTML = `
              <div data-v-1d580398="" class="hide-mobile col-2"><b data-v-1d580398="">#</b>${position}</div>
              <div data-v-1d580398="" class="col-5">
                  <img data-v-1d580398="" src="${user.user.avatar}" style="width: 32px; height: 32px; border-radius: 50%;">
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
        1: "$ 150",
        2: "$ 75",
        3: "$ 40",
        4: "$ 25",
        5: "$ 10",
    };
    return prizes[position] || "";
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
    fetchPreviousLeaderboard();
});