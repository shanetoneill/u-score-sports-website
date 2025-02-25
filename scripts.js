console.log('Script is running!');

// API configuration
const API_KEY = '1ee1f47c697a36311363a15a36e51802'; // Your API key is already set
const FOOTBALL_API_URL = 'https://v3.football.api-sports.io';
const BASKETBALL_API_URL = 'https://v1.basketball.api-sports.io';
const BASEBALL_API_URL = 'https://v1.baseball.api-sports.io';

// Configuration for updates
const LIVE_UPDATE_INTERVAL = 30000;
const COMPLETED_UPDATE_INTERVAL = 300000;

// Track if we have any live games
let hasLiveGames = false;

async function fetchNFLScores() {
    console.log('Attempting to fetch NFL scores...');
    
    try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
        console.log('API Response Status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('NFL Data received:', data);

        const scoresSection = document.querySelector('.scores-section');
        scoresSection.innerHTML = '<h2>Football Scores</h2>';

        if (data.events && data.events.length > 0) {
            data.events.forEach(event => {
                const homeTeam = event.competitions[0].competitors.find(team => team.homeAway === 'home');
                const awayTeam = event.competitions[0].competitors.find(team => team.homeAway === 'away');
                
                const scoreCard = `
                    <div class="game-score">
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
                    </div>
                `;
                scoresSection.innerHTML += scoreCard;
            });
        } else {
            scoresSection.innerHTML += '<p>No games currently in progress.</p>';
        }

    } catch (error) {
        console.error('Error fetching NFL scores:', error);
        const scoresSection = document.querySelector('.scores-section');
        scoresSection.innerHTML = `
            <h2>Football Scores</h2>
            <p>Error loading scores. Please try again later.</p>
        `;
    }
}

async function fetchNBAScores() {
    console.log('Attempting to fetch NBA scores...');
    
    try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
        console.log('API Response Status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('NBA Data received:', data);

        // Show loading state
        const scoresSection = document.querySelector('.scores-section');
        scoresSection.innerHTML = '<h2>Basketball Scores</h2><p>Loading scores...</p>';

        if (data.events && data.events.length > 0) {
            let scoresHTML = '<h2>Basketball Scores</h2>';
            
            data.events.forEach(event => {
                const homeTeam = event.competitions[0].competitors.find(team => team.homeAway === 'home');
                const awayTeam = event.competitions[0].competitors.find(team => team.homeAway === 'away');
                
                scoresHTML += `
                    <div class="game-score">
                        <div class="team">
                            <img src="${awayTeam.team.logo}" alt="${awayTeam.team.displayName}" class="team-logo">
                            <span>${awayTeam.team.abbreviation}</span>
                            <span class="score">${awayTeam.score}</span>
                        </div>
                        <div class="game-info">
                            ${event.status.type.shortDetail}
                        </div>
                        <div class="team">
                            <img src="${homeTeam.team.logo}" alt="${homeTeam.team.displayName}" class="team-logo">
                            <span>${homeTeam.team.abbreviation}</span>
                            <span class="score">${homeTeam.score}</span>
                        </div>
                    </div>
                `;
            });

            scoresSection.innerHTML = scoresHTML;
        } else {
            scoresSection.innerHTML = `
                <h2>Basketball Scores</h2>
                <p>No games currently in progress.</p>
            `;
        }

    } catch (error) {
        console.error('Error fetching NBA scores:', error);
        const scoresSection = document.querySelector('.scores-section');
        scoresSection.innerHTML = `
            <h2>Basketball Scores</h2>
            <p>Error loading scores. Please try again later.</p>
        `;
    }
}

async function fetchMLBScores() {
    console.log('Attempting to fetch MLB scores...');
    
    try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard');
        console.log('MLB API Response Status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const games = data.events;
        const scoresContainer = document.getElementById('mlb-scores');
        scoresContainer.innerHTML = ''; // Clear existing scores
        
        games.forEach(game => {
            const homeTeam = game.competitions[0].competitors.find(team => team.homeAway === 'home');
            const awayTeam = game.competitions[0].competitors.find(team => team.homeAway === 'away');
            const gameStatus = game.status.type;
            
            const scoreCard = document.createElement('div');
            scoreCard.className = 'score-card';
            
            const isLive = gameStatus.state === 'in';
            const isFinal = gameStatus.state === 'post';
            
            scoreCard.innerHTML = `
                <div class="team-info">
                    <img src="${awayTeam.team.logo}" alt="${awayTeam.team.abbreviation}" class="team-logo">
                    <span>${awayTeam.team.abbreviation}</span>
                    <span class="score">${awayTeam.score}</span>
                </div>
                <div class="team-info">
                    <img src="${homeTeam.team.logo}" alt="${homeTeam.team.abbreviation}" class="team-logo">
                    <span>${homeTeam.team.abbreviation}</span>
                    <span class="score">${homeTeam.score}</span>
                </div>
                <div class="game-status ${isLive ? 'live' : ''}">
                    ${isLive ? 'LIVE' : isFinal ? 'Final' : gameStatus.shortDetail}
                </div>
            `;
            
            scoresContainer.appendChild(scoreCard);
        });
        
    } catch (error) {
        console.error('Error fetching MLB scores:', error);
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

// Initialize updates when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, checking current page...');
    if (window.location.pathname.includes('football.html')) {
        console.log('On football page, fetching scores...');
        fetchNFLScores();
    } else if (window.location.pathname.includes('basketball.html')) {
        console.log('On basketball page, fetching scores...');
        fetchNBAScores();
    } else if (window.location.pathname.includes('baseball.html')) {
        console.log('On baseball page, fetching scores...');
        fetchMLBScores();
    }
});

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

// Add MLB scores section to HTML
document.getElementById('scores-container').innerHTML += `
    <div class="sport-section">
        <h2>MLB Scores</h2>
        <div id="mlb-scores" class="scores-grid"></div>
    </div>
`;

// Update the refresh function to include MLB scores
async function refreshScores() {
    await Promise.all([
        fetchNBAScores(),
        fetchNFLScores(),
        fetchMLBScores()
    ]);
} 