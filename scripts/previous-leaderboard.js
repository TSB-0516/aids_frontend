document.addEventListener("DOMContentLoaded", () => {
  fetchLeaderboard();
  setInterval(fetchLeaderboard, 60000); // Refresh every minute
});

async function fetchLeaderboard() {
  try {
    document.getElementById("loadingOverlay").classList.remove("hide");
    const response = await fetch("https://aids-backend.onrender.com/previous-leaderboards", {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    document.getElementById("loadingOverlay").classList.add("hide");

    if (data.error) {
      console.error("Error:", data.error);
      return;
    }

    // Update leaderboard if data exists
    if (data && Array.isArray(data) && data.length > 0) {
      // Get the most recent archived leaderboard
      const mostRecentLeaderboard = data[data.length - 1];
      
      if (mostRecentLeaderboard && mostRecentLeaderboard.summarizedBets) {
        const sortedUsers = mostRecentLeaderboard.summarizedBets.sort(
          (a, b) => parseFloat(b.wager) - parseFloat(a.wager)
        );
        updateTop3(sortedUsers.slice(0, 3));
        updateRemainingPositions(sortedUsers.slice(3, 10));
      } else {
        showEmptyState("No previous leaderboard data available");
      }
    } else {
      showEmptyState("No previous leaderboard data available");
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    showToast("Error loading previous leaderboard data");
  }
}

function updateTop3(top3Users) {
  // Add mobile-only styles at the start
  const mobileStyle = document.createElement('style');
  mobileStyle.textContent = `
      @media screen and (max-width: 768px) {
          .css-gqrafh {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              width: 100% !important;
          }
          .css-jehefp, .css-oijls1 {
              position: relative !important;
              left: 41% !important;
              transform: translateX(-50%) !important;
              margin: 10px 0 !important;
          }
      }
  `;
  document.head.appendChild(mobileStyle);

  const positions = document.querySelectorAll('.css-gqrafh .css-jehefp, .css-gqrafh .css-oijls1');
  const positionOrder = [1, 0, 2];

  positionOrder.forEach((positionIndex, i) => {
      const user = top3Users[i];
      if (user && positions[positionIndex]) {
          const position = positions[positionIndex];
          try {
              position.style.overflow = 'hidden';
              
              // Use avatar directly from the response data
              const avatarUrl = user.avatar || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjFWMTlhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg==';
              const displayName = user.username || 'Anonymous';
              
              position.innerHTML = `
                  <div class="top3-card-content" style="
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: space-between;
                      height: 100%;
                      width: 100%;
                      gap: clamp(8px, 2vh, 15px);
                      padding: 5px;
                      overflow: hidden !important;
                      -ms-overflow-style: none !important;
                      scrollbar-width: none !important;
                      margin: 0 auto;
                  ">
                      <img 
                          src="${avatarUrl}" 
                          alt="Avatar" 
                          style="
                              width: clamp(45px, 25%, 80px);
                              height: clamp(45px, 25%, 80px);
                              border-radius: 50%;
                              object-fit: cover;
                              margin-bottom: 5px;
                              background-color: #1a2234;
                          "
                          onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjFWMTlhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg=='"
                      />
                      <div class="user-name" style="
                          font-size: clamp(13px, 2vw, 16px);
                          color: #fff;
                          text-align: center;
                          width: 90%;
                          overflow: hidden !important;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                          margin: 0 auto;
                          line-height: 1.2;
                          -ms-overflow-style: none !important;
                          scrollbar-width: none !important;
                      ">${displayName}</div>
                      <div class="wager-amount" style="
                          font-size: clamp(11px, 1.8vw, 14px);
                          color: #8b8b8b;
                          text-align: center;
                          margin: 5px 0;
                          overflow: hidden !important;
                          -ms-overflow-style: none !important;
                          scrollbar-width: none !important;
                      ">
                          <span>Wagered</span><br>
                          <span style="
                              color: #fff;
                              font-size: clamp(13px, 2vw, 16px);
                          ">$ ${parseFloat(user.wager).toFixed(2)}</span>
                      </div>
                      <div class="prize-amount" style="
                          font-size: clamp(15px, 2.5vw, 20px);
                          color: rgb(37, 99, 235);
                          font-weight: bold;
                          text-align: center;
                          margin-top: auto;
                          padding-bottom: 5px;
                          overflow: hidden !important;
                          -ms-overflow-style: none !important;
                          scrollbar-width: none !important;
                      ">$ ${getPrize(i + 1).replace('$', '')}</div>
                  </div>
              `;

              const positionLabel = document.createElement('div');
              positionLabel.style.cssText = `
                  position: absolute;
                  top: 10px;
                  left: 10px;
                  background: rgb(37, 99, 235);
                  color: #fff;
                  padding: 5px 10px;
                  border-radius: 5px;
                  font-size: clamp(11px, 1.8vw, 14px);
                  font-weight: bold;
              `;
              positionLabel.textContent = `#${i + 1}`;
              position.appendChild(positionLabel);

          } catch (error) {
              console.error('Error updating position', positionIndex, error);
          }
      }
  });
}

function updateRemainingPositions(users) {
  const listContainer = document.querySelector('.list-container');
  if (!listContainer) return;
  
  listContainer.innerHTML = '';

  // Keep header row exactly as is, but add mobile-specific styles
  const headerRow = document.createElement("div");
  headerRow.className = "row header";
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

  // Add mobile-specific styles
  const style = document.createElement('style');
  style.textContent = `
      @media screen and (max-width: 768px) {
          .row.header {
              height: 40px !important;
              padding: 0 20px !important;
              font-size: 14px !important;
          }
          .header-text {
              font-size: 14px !important;
              white-space: nowrap !important;
          }
      }
  `;
  document.head.appendChild(style);

  headerRow.innerHTML = `
      <div style="color: #fff; flex: 0 0 15%; display: flex; justify-content: center; align-items: center;"><span class="header-text">Place</span></div>
      <div style="color: #fff; flex: 0 0 40%; display: flex; justify-content: center; align-items: center;"><span class="header-text">User</span></div>
      <div style="color: #fff; flex: 0 0 25%; display: flex; justify-content: center; align-items: center;"><span class="header-text">Wager</span></div>
      <div style="color: #fff; flex: 0 0 20%; display: flex; justify-content: center; align-items: center;"><span class="header-text">Prize</span></div>
  `;
  listContainer.appendChild(headerRow);

  // Add desktop-only styles
  const desktopStyle = document.createElement('style');
  desktopStyle.textContent = `
      @media screen and (min-width: 769px) {
          .player-row {
              height: 60px !important;
              display: grid !important;
              grid-template-columns: 15% 40% 25% 20% !important;
              align-items: center !important;
          }
          .player-row > div {
              height: 100% !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
          }
          .player-row .place-number {
              font-size: 20px !important;
          }
          .player-row .prize-amount {
              font-size: 20px !important;
          }
          .player-row .user-name {
              font-weight: bold !important;
              font-size: 16px !important;
          }
      }
  `;
  document.head.appendChild(desktopStyle);

  // Updated player rows
  users.forEach((user, index) => {
      const position = index + 4;
      const row = document.createElement("div");
      row.className = "row list player-row";
      row.style.cssText = `
          border: 1px solid rgb(37, 99, 235);
          border-radius: 8px;
          background: rgba(13, 18, 27, 0.75);
          margin-bottom: 15px;
          width: 100%;
          max-width: 1600px;
          margin: 0 auto 15px auto;
      `;

      // Add safety checks for user data
      const displayName = user.username || 'Anonymous';
      
      row.innerHTML = `
          <div style="
              color: rgb(37, 99, 235);
              font-weight: bold;
              padding: 0 10px;
          "><span class="place-number">#${position}</span></div>
          
          <div style="
              color: #fff;
              padding: 0 10px;
          ">
              <span class="user-name" style="
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  text-align: center;
              ">${displayName}</span>
          </div>
          
          <div style="
              color: #fff;
              padding: 0 10px;
          ">$ ${parseFloat(user.wager).toFixed(2)}</div>
          
          <div style="
              padding: 0 10px;
          ">
              <span class="prize-amount" style="
                  color: rgb(37, 99, 235);
                  font-weight: bold;
              ">${getPrize(position)}</span>
          </div>
      `;

      listContainer.appendChild(row);
  });
}

function getPrize(position) {
  const prizes = {
    1: '$650',
    2: '$350',
    3: '$200',
    4: '$125',
    5: '$75',
    6: '$50',
    7: '$25',
    8: '$20',
    9: '$15',
    10: '$10'
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
