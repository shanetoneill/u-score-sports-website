console.log('Script is running!');

// Configuration for updates
const LIVE_UPDATE_INTERVAL = 30000;
const COMPLETED_UPDATE_INTERVAL = 300000;

// Track if we have any live games
let hasLiveGames = false;

// Check if we're on a specific sport page and return the appropriate fetch function
function getPageFunction() {
    const path = window.location.pathname;
    if (path.includes('football.html')) {
        return { func: fetchNFLScores, title: 'Football Scores' };
    } else if (path.includes('basketball.html')) {
        return { func: fetchNBAScores, title: 'Basketball Scores' };
    } else if (path.includes('baseball.html')) {
        return { func: fetchMLBScores, title: 'Baseball Scores' };
    }
    return null;
}

// Create scores section if it doesn't exist
function ensureScoresSection(title) {
    let scoresSection = document.querySelector('.scores-section');
    if (!scoresSection) {
        scoresSection = document.createElement('section');
        scoresSection.className = 'scores-section';
        const main = document.querySelector('main');
        if (main) {
            main.appendChild(scoresSection);
        }
    }
    scoresSection.innerHTML = `<h2>${title}</h2>`;
    return scoresSection;
}

// Wait for DOM to be fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, checking current page...');
    const pageInfo = getPageFunction();
    if (pageInfo) {
        ensureScoresSection(pageInfo.title);
        pageInfo.func();
    } else {
        console.log('On home page or unknown page');
    }
});

async function fetchNBAScores() {
    console.log('Attempting to fetch NBA scores...');
    const scoresSection = document.querySelector('.scores-section');
    const heading = scoresSection.querySelector('h2');
    scoresSection.innerHTML = '';
    scoresSection.appendChild(heading);
    
    try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('NBA Data received:', data);

        if (data.events && data.events.length > 0) {
            const gamesContainer = document.createElement('div');
            gamesContainer.className = 'games-container';
            
            data.events.forEach(event => {
                const homeTeam = event.competitions[0].competitors.find(team => team.homeAway === 'home');
                const awayTeam = event.competitions[0].competitors.find(team => team.homeAway === 'away');
                
                const scoreCard = document.createElement('div');
                scoreCard.className = 'game-score';
                scoreCard.innerHTML = `
                    <div class="team">
                        <img src="${awayTeam.team.logo}" alt="${awayTeam.team.displayName}" class="team-logo">
                        <span>${awayTeam.team.abbreviation}</span>
                        <span class="score">${awayTeam.score || '0'}</span>
                    </div>
                    <div class="game-info">
                        ${event.status.type.shortDetail}
                        ${event.status.type.state === 'in' ? 
                            `<div class="live-indicator">LIVE</div>` : ''}
                    </div>
                    <div class="team">
                        <img src="${homeTeam.team.logo}" alt="${homeTeam.team.displayName}" class="team-logo">
                        <span>${homeTeam.team.abbreviation}</span>
                        <span class="score">${homeTeam.score || '0'}</span>
                    </div>
                `;
                gamesContainer.appendChild(scoreCard);
            });
            
            scoresSection.appendChild(gamesContainer);
        } else {
            const noGames = document.createElement('p');
            noGames.textContent = 'No games currently in progress.';
            scoresSection.appendChild(noGames);
        }

    } catch (error) {
        console.error('Error fetching NBA scores:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error loading scores. Please try again later.';
        scoresSection.appendChild(errorMessage);
    }
}

async function fetchNFLScores() {
    console.log('Attempting to fetch NFL scores...');
    const scoresSection = document.querySelector('.scores-section');
    const heading = scoresSection.querySelector('h2');
    scoresSection.innerHTML = '';
    scoresSection.appendChild(heading);
    
    try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('NFL Data received:', data);

        if (data.events && data.events.length > 0) {
            const gamesContainer = document.createElement('div');
            gamesContainer.className = 'games-container';
            
            data.events.forEach(event => {
                const homeTeam = event.competitions[0].competitors.find(team => team.homeAway === 'home');
                const awayTeam = event.competitions[0].competitors.find(team => team.homeAway === 'away');
                
                const scoreCard = document.createElement('div');
                scoreCard.className = 'game-score';
                scoreCard.innerHTML = `
                    <div class="team">
                        <img src="${awayTeam.team.logo}" alt="${awayTeam.team.displayName}" class="team-logo">
                        <span>${awayTeam.team.abbreviation}</span>
                        <span class="score">${awayTeam.score || '0'}</span>
                    </div>
                    <div class="game-info">
                        ${event.status.type.shortDetail}
                        ${event.status.type.state === 'in' ? 
                            `<div class="live-indicator">LIVE</div>` : ''}
                    </div>
                    <div class="team">
                        <img src="${homeTeam.team.logo}" alt="${homeTeam.team.displayName}" class="team-logo">
                        <span>${homeTeam.team.abbreviation}</span>
                        <span class="score">${homeTeam.score || '0'}</span>
                    </div>
                `;
                gamesContainer.appendChild(scoreCard);
            });
            
            scoresSection.appendChild(gamesContainer);
        } else {
            const noGames = document.createElement('p');
            noGames.textContent = 'No games currently in progress.';
            scoresSection.appendChild(noGames);
        }

    } catch (error) {
        console.error('Error fetching NFL scores:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error loading scores. Please try again later.';
        scoresSection.appendChild(errorMessage);
    }
}

async function fetchMLBScores() {
    console.log('Attempting to fetch MLB scores...');
    const scoresSection = document.querySelector('.scores-section');
    const heading = scoresSection.querySelector('h2');
    scoresSection.innerHTML = '';
    scoresSection.appendChild(heading);
    
    try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('MLB Data received:', data);

        if (data.events && data.events.length > 0) {
            const gamesContainer = document.createElement('div');
            gamesContainer.className = 'games-container';
            
            data.events.forEach(event => {
                const homeTeam = event.competitions[0].competitors.find(team => team.homeAway === 'home');
                const awayTeam = event.competitions[0].competitors.find(team => team.homeAway === 'away');
                
                const scoreCard = document.createElement('div');
                scoreCard.className = 'game-score';
                scoreCard.innerHTML = `
                    <div class="team">
                        <img src="${awayTeam.team.logo}" alt="${awayTeam.team.displayName}" class="team-logo">
                        <span>${awayTeam.team.abbreviation}</span>
                        <span class="score">${awayTeam.score || '0'}</span>
                    </div>
                    <div class="game-info">
                        ${event.status.type.shortDetail}
                        ${event.status.type.state === 'in' ? 
                            `<div class="live-indicator">LIVE</div>` : ''}
                    </div>
                    <div class="team">
                        <img src="${homeTeam.team.logo}" alt="${homeTeam.team.displayName}" class="team-logo">
                        <span>${homeTeam.team.abbreviation}</span>
                        <span class="score">${homeTeam.score || '0'}</span>
                    </div>
                `;
                gamesContainer.appendChild(scoreCard);
            });
            
            scoresSection.appendChild(gamesContainer);
        } else {
            const noGames = document.createElement('p');
            noGames.textContent = 'No games currently in progress.';
            scoresSection.appendChild(noGames);
        }

    } catch (error) {
        console.error('Error fetching MLB scores:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error loading scores. Please try again later.';
        scoresSection.appendChild(errorMessage);
    }
}

function updateFootballScores(games) {
    const scoresSection = document.querySelector('.scores-section');
    scoresSection.innerHTML = '<h2>Football Scores</h2>';
    
    if (games.length === 0) {
        scoresSection.innerHTML += '<p>No games available</p>';
        return;
    }

    games.forEach(game => {
        const scoreCard = `
            <div class="score-card">
                <div class="date">${new Date(game.fixture.date).toLocaleDateString()}</div>
                <div class="team">
                    <span class="team-name">${game.teams.home.name}</span>
                    <span class="score">${game.goals.home || '-'}</span>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                    <span class="team-name">${game.teams.away.name}</span>
                    <span class="score">${game.goals.away || '-'}</span>
                </div>
                <div class="status">${game.fixture.status.long}</div>
            </div>
        `;
        scoresSection.innerHTML += scoreCard;
    });
}

function updateBasketballScores(games) {
    const scoresSection = document.querySelector('.scores-section');
    scoresSection.innerHTML = '<h2>Basketball Scores</h2>';
    
    if (!games || games.length === 0) {
        scoresSection.innerHTML += `
            <p>No games found. The NBA might not have any games scheduled for this date.</p>
            <p>Note: During off-season or between game days, there might not be any recent games to display.</p>
        `;
        return;
    }

    games.forEach(game => {
        const gameDate = new Date(game.date);
        const scoreCard = `
            <div class="score-card">
                <div class="date">${gameDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</div>
                <div class="team">
                    <span class="team-name">${game.teams.home.name}</span>
                    <span class="score">${game.scores?.home?.total || '-'}</span>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                    <span class="team-name">${game.teams.away.name}</span>
                    <span class="score">${game.scores?.away?.total || '-'}</span>
                </div>
                <div class="status">${getGameStatus(game.status)}</div>
            </div>
        `;
        scoresSection.innerHTML += scoreCard;
    });
}

function updateBaseballScores(games) {
    const scoresSection = document.querySelector('.scores-section');
    scoresSection.innerHTML = '<h2>Baseball Scores</h2>';
    
    if (games.length === 0) {
        scoresSection.innerHTML += '<p>No games available</p>';
        return;
    }

    games.forEach(game => {
        const scoreCard = `
            <div class="score-card">
                <div class="date">${new Date(game.date).toLocaleDateString()}</div>
                <div class="team">
                    <span class="team-name">${game.teams.home.name}</span>
                    <span class="score">${game.scores.home.total || '-'}</span>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                    <span class="team-name">${game.teams.away.name}</span>
                    <span class="score">${game.scores.away.total || '-'}</span>
                </div>
                <div class="status">${game.status.long}</div>
            </div>
        `;
        scoresSection.innerHTML += scoreCard;
    });
}

function formatGameTime(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Time TBD';
    }
}

function getGameStatus(status) {
    if (!status) return 'Scheduled';
    return status.long || status;
}

function displayError(sport) {
    const scoresSection = document.querySelector('.scores-section');
    scoresSection.innerHTML = `
        <h2>${sport.charAt(0).toUpperCase() + sport.slice(1)} Scores</h2>
        <p>Unable to load scores. Please try again later.</p>
    `;
}

// Add some additional CSS for football-specific styling
const additionalStyles = `
    .live-indicator {
        color: red;
        font-weight: bold;
        font-size: 12px;
        margin-top: 5px;
        animation: blink 1s infinite;
    }

    @keyframes blink {
        50% { opacity: 0.5; }
    }
`;

// Add the styles to the page
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Update the refresh function to include MLB scores
async function refreshScores() {
    await Promise.all([
        fetchNBAScores(),
        fetchNFLScores(),
        fetchMLBScores()
    ]);
} 