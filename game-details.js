document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');
    const sport = urlParams.get('sport') || 'NFL'; // Default to NFL if not specified
    
    if (gameId) {
        fetchGameDetails(gameId, sport);
    } else {
        document.getElementById('game-info').textContent = 'No game specified.';
    }
});

async function fetchGameDetails(gameId, sport) {
    try {
        const apiUrl = getApiUrl(sport, gameId);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayGameDetails(data, sport);
    } catch (error) {
        console.error('Error fetching game details:', error);
        document.getElementById('game-info').textContent = 'Error loading game details.';
    }
}

function getApiUrl(sport, gameId) {
    switch(sport.toUpperCase()) {
        case 'NBA':
            return `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${gameId}`;
        case 'MLB':
            return `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary?event=${gameId}`;
        case 'NFL':
        default:
            return `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`;
    }
}

function displayGameDetails(data, sport) {
    const gameInfo = document.getElementById('game-info');
    gameInfo.innerHTML = ''; // Clear previous content
    
    // Basic game info
    const header = document.createElement('div');
    header.className = 'game-header';
    
    // Get teams data safely
    const teams = data.header?.competitions?.[0]?.competitors || [];
    
    // Fix for undefined game name
    const gameName = teams.length >= 2 ?
        `${teams[0].team.abbreviation} vs ${teams[1].team.abbreviation}` :
        `${sport} Game`;
    
    header.innerHTML = `
        <h3>${gameName}</h3>
        <p>${data.header?.competitions?.[0]?.status?.type?.shortDetail || 'Game details not available'}</p>
    `;
    gameInfo.appendChild(header);
    
    // Teams
    const teamsContainer = document.createElement('div');
    teamsContainer.className = 'game-teams';
    
    teams.forEach(team => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team';
        
        // Fix for team logos
        const logoUrl = team.team?.logos?.[0]?.href || 
            'https://via.placeholder.com/100';
        
        teamDiv.innerHTML = `
            <img src="${logoUrl}" alt="${team.team?.displayName || 'Team'}" class="team-logo">
            <span>${team.team?.abbreviation || 'TBD'}</span>
            <span class="score">${team.score || '0'}</span>
        `;
        teamsContainer.appendChild(teamDiv);
    });
    
    gameInfo.appendChild(teamsContainer);
    
    // Add more details
    const details = document.createElement('div');
    details.className = 'game-details';
    
    // Add venue information if available
    if (data.gameInfo?.venue) {
        const venue = document.createElement('p');
        venue.className = 'venue';
        const venueLocation = [
            data.gameInfo.venue.city,
            data.gameInfo.venue.state
        ].filter(Boolean).join(', ');
        
        venue.textContent = `Venue: ${data.gameInfo.venue.fullName}${venueLocation ? `, ${venueLocation}` : ''}`;
        details.appendChild(venue);
    }
    
    // Add weather information if available
    if (data.gameInfo?.weather) {
        const weather = document.createElement('p');
        weather.className = 'weather';
        weather.textContent = `Weather: ${data.gameInfo.weather.displayValue}, ${data.gameInfo.weather.temperature}°F`;
        details.appendChild(weather);
    }
    
    gameInfo.appendChild(details);
    
    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs-container';
    
    // Create tab buttons
    const tabButtons = document.createElement('div');
    tabButtons.className = 'tab-buttons';
    
    const teamStatsButton = document.createElement('button');
    teamStatsButton.className = 'tab-button active';
    teamStatsButton.textContent = 'Team Stats';
    teamStatsButton.addEventListener('click', () => {
        showTab('team-stats');
        teamStatsButton.classList.add('active');
        playerStatsButton.classList.remove('active');
    });
    
    const playerStatsButton = document.createElement('button');
    playerStatsButton.className = 'tab-button';
    playerStatsButton.textContent = 'Stat Leaders';
    playerStatsButton.addEventListener('click', () => {
        showTab('player-stats');
        playerStatsButton.classList.add('active');
        teamStatsButton.classList.remove('active');
    });
    
    tabButtons.appendChild(teamStatsButton);
    tabButtons.appendChild(playerStatsButton);
    tabsContainer.appendChild(tabButtons);
    
    // Create tab content container
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    
    // Team stats tab
    const teamStatsTab = document.createElement('div');
    teamStatsTab.id = 'team-stats';
    teamStatsTab.className = 'tab-pane active';
    
    if (data.boxscore?.teams) {
        data.boxscore.teams.forEach(team => {
            const teamStats = document.createElement('div');
            teamStats.className = 'team-stats';
            
            // Team header
            const teamHeader = document.createElement('div');
            teamHeader.className = 'team-header';
            const teamLogoUrl = team.team?.logos?.[0]?.href || 
                team.team?.logo || 
                'https://via.placeholder.com/40';
            
            teamHeader.innerHTML = `
                <img src="${teamLogoUrl}" 
                     alt="${team.team?.abbreviation || 'Team'}" 
                     class="team-logo-small">
                <span>${team.team?.abbreviation || 'TBD'}</span>
            `;
            teamStats.appendChild(teamHeader);
            
            // Statistics table
            const statsTable = document.createElement('table');
            statsTable.className = 'stats-table';
            
            // Add table headers
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Stat</th>
                    <th>Value</th>
                </tr>
            `;
            statsTable.appendChild(thead);
            
            // Add table body
            const tbody = document.createElement('tbody');
            if (team.statistics) {
                team.statistics.forEach(stat => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${stat.name || 'N/A'}</td>
                        <td>${stat.displayValue || '0'}</td>
                    `;
                    tbody.appendChild(row);
                });
            }
            statsTable.appendChild(tbody);
            
            teamStats.appendChild(statsTable);
            teamStatsTab.appendChild(teamStats);
        });
    }
    
    tabContent.appendChild(teamStatsTab);
    
    // Stat Leaders tab
    const playerStatsTab = document.createElement('div');
    playerStatsTab.className = 'tab-content';
    playerStatsTab.id = 'stat-leaders';
    
    if (data.leaders?.length > 0) {
        console.log('Leaders data:', data.leaders);
        
        const playersContainer = document.createElement('div');
        playersContainer.className = 'players-container';
        
        // Create a map to group players by team
        const teamMap = new Map();
        
        data.leaders.forEach(teamLeaders => {
            if (teamLeaders.leaders?.length > 0) {
                teamLeaders.leaders.forEach(category => {
                    if (category.leaders?.length > 0) {
                        category.leaders.forEach(leader => {
                            const teamAbbreviation = teamLeaders.team?.abbreviation || 'TBD';
                            
                            if (!teamMap.has(teamAbbreviation)) {
                                teamMap.set(teamAbbreviation, []);
                            }
                            
                            teamMap.get(teamAbbreviation).push({
                                category: category.displayName,
                                leader: leader
                            });
                        });
                    }
                });
            }
        });
        
        // Create sections for each team
        teamMap.forEach((players, teamAbbreviation) => {
            const teamSection = document.createElement('div');
            teamSection.className = 'team-section';
            
            // Team header
            const teamHeader = document.createElement('div');
            teamHeader.className = 'team-header';
            teamHeader.textContent = teamAbbreviation;
            teamSection.appendChild(teamHeader);
            
            // Player stats
            players.forEach(player => {
                const playerCard = document.createElement('div');
                playerCard.className = 'player-card';
                
                const playerName = player.leader.athlete?.displayName || 'Player';
                const statValue = player.leader.displayValue || 'No stats available';
                
                const headshotUrl = player.leader.athlete?.headshot?.href ?
                    player.leader.athlete.headshot.href.replace('http://', 'https://') :
                    'images/football_player_placeholder.png';
                
                playerCard.innerHTML = `
                    <div class="player-header">
                        <img src="${headshotUrl}" 
                             alt="${playerName}" 
                             class="player-headshot"
                             onerror="this.src='images/football_player_placeholder.png'">
                        <div class="player-info">
                            <span class="player-name">${playerName}</span>
                            <span class="player-category">${player.category}</span>
                        </div>
                    </div>
                    <div class="stats-info">
                        <p class="stat-value">${statValue}</p>
                    </div>
                `;
                
                teamSection.appendChild(playerCard);
            });
            
            playersContainer.appendChild(teamSection);
        });
        
        playerStatsTab.appendChild(playersContainer);
    } else {
        console.log('No leaders data found');
        const noLeaders = document.createElement('p');
        noLeaders.className = 'no-leaders';
        noLeaders.textContent = 'No player statistics available';
        playerStatsTab.appendChild(noLeaders);
    }
    
    tabContent.appendChild(playerStatsTab);
    tabsContainer.appendChild(tabContent);
    gameInfo.appendChild(tabsContainer);

    // Revert to simple tab label
    const statsTabLink = document.createElement('a');
    statsTabLink.href = '#stat-leaders';
    statsTabLink.textContent = 'Stat Leaders';  // Removed teams under tab
    statsTabLink.addEventListener('click', () => {
        showTab('stat-leaders');
    });
}

// Tab switching function
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-pane');
    tabs.forEach(tab => {
        if (tab.id === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
} 