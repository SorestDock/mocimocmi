// ===== PERFORMANCE OPTIMIZATION: PRE-CALCULATED CHART DATA =====
// All chart data is pre-calculated and stored in memory for instant rendering
// No setTimeout delays, no async operations - pure synchronous rendering

const CHART_CACHE = {
  initialized: false,
  languagePie: null,
  literacyScatter: null,
  survivalBar: null,
  frequencyLang: null,
  foreignLanguage: null,
  registration: null
};

// ===== CHART COLOR PALETTE - CONSISTENT ACROSS ALL VISUALIZATIONS =====
const CHART_COLORS = {
  primary: '#1FB8CD',    // Teal
  secondary: '#FFC185',  // Orange
  tertiary: '#B4413C',   // Red
  quaternary: '#5D878F', // Slate
  accent: '#D4AF37',     // Gold
  fills: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B', '#7A6430', '#D4AF37']
};

// ===== PLOTLY HOVER CONFIGURATION - CONSISTENT TOOLTIPS =====
const PLOTLY_HOVER_CONFIG = {
  bgcolor: '#F5E6D3',
  bordercolor: '#1A1A1A',
  font: { size: 14, family: 'Merriweather, Georgia, serif', color: '#2C1810' }
};

// ===== PLOTLY LAYOUT DEFAULTS - CONSISTENT STYLING =====
const PLOTLY_LAYOUT_DEFAULTS = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: '#FEFEFE',
  font: { family: 'Merriweather, Georgia, serif' }
};

// State data mapping
const STATE_DATA = {
  'Maharashtra': [1, 31, 370, 1935, 1839, 1021, 2461, 4287, 3236],
  'Uttar Pradesh': [1, 22, 473, 1895, 1969, 1431, 4776, 4927, 2319],
  'Tamil Nadu': [1, 21, 402, 1240, 1124, 516, 1058, 2040, 869],
  'Kerala': [1, 14, 188, 718, 877, 407, 469, 853, 528],
  'Delhi': [1, 10, 490, 1522, 1851, 1698, 2911, 4129, 1651],
  'Rajasthan': [1, 3, 148, 530, 710, 801, 1462, 1691, 868],
  'Chhattisgarh': [1, 0, 0, 2, 3, 6, 3, 374, 445],
  'West Bengal': [0, 21, 503, 1605, 1534, 802, 956, 1082, 435],
  'Karnataka': [0, 20, 229, 367, 728, 528, 971, 1883, 1157],
  'Andhra Pradesh': [0, 14, 209, 665, 717, 436, 860, 2129, 1561],
  'Bihar': [0, 11, 115, 171, 379, 632, 466, 212, 142],
  'Gujarat': [0, 10, 122, 636, 465, 201, 1059, 1593, 1159],
  'Punjab': [0, 4, 54, 576, 595, 295, 357, 790, 160],
  'Madhya Pradesh': [0, 3, 62, 401, 605, 1019, 1975, 2151, 2521],
  'Assam': [0, 1, 22, 103, 101, 109, 177, 179, 67],
  'Puducherry': [0, 1, 3, 21, 30, 14, 9, 53, 26],
  'Odisha': [0, 0, 70, 253, 292, 230, 356, 629, 310],
  'Haryana': [0, 0, 11, 239, 373, 222, 437, 472, 216],
  'Himachal Pradesh': [0, 0, 8, 51, 40, 25, 78, 80, 42],
  'Tripura': [0, 0, 8, 4, 34, 22, 18, 22, 21],
  'Manipur': [0, 0, 6, 51, 46, 39, 33, 20, 12],
  'Chandigarh': [0, 0, 3, 43, 46, 60, 115, 124, 48],
  'Jammu and Kashmir': [0, 0, 1, 69, 127, 78, 108, 281, 306],
  'Jharkhand': [0, 0, 1, 0, 1, 1, 1, 92, 105],
  'Mizoram': [0, 0, 1, 3, 33, 50, 40, 40, 17],
  'Nagaland': [0, 0, 1, 2, 3, 3, 6, 5, 2],
  'Goa': [0, 0, 0, 24, 25, 25, 11, 36, 16],
  'Meghalaya': [0, 0, 0, 7, 17, 10, 10, 14, 6],
  'Uttarakhand': [0, 0, 0, 3, 3, 0, 15, 1026, 1075],
  'Andaman and Nicobar Islands': [0, 0, 0, 3, 7, 10, 26, 21, 11],
  'Sikkim': [0, 0, 0, 1, 0, 5, 17, 65, 17],
  'Arunachal Pradesh': [0, 0, 0, 0, 0, 2, 3, 8, 5],
  'Lakshadweep': [0, 0, 0, 0, 0, 2, 1, 2, 2],
  'Daman and Diu': [0, 0, 0, 0, 0, 0, 1, 8, 3],
  'Dadra and Nagar Haveli': [0, 0, 0, 0, 0, 0, 0, 14, 7]
};

const DECADES = [
  { 
    id: 0,
    label: '1900-1940',
    edition: 'COLONIAL EDITION',
    title: 'Press Under Censorship', 
    context: 'Limited press due to restrictive colonial policies and severe censorship under press laws. Publishing restricted to major colonial centers.',
    analysis: "The extremely low periodical counts across India during 1900-1940 directly reflect the severe colonial censorship documented in the project. As the qualitative research shows, the colonial regime implemented a series of increasingly stringent legislative acts including the <em>Press Act of 1857</em> (the 'gagging act'), the <em>Vernacular Press Act of 1878</em>, and the <em>Indian Press Act of 1910</em>, which placed the Indian press under 'direct executive control.' The <em>Press Ordinance Act of 1930</em> and <em>Indian Press Act of 1931</em> further tightened control during the Civil Disobedience Movement, forcing approximately 450 newspapers to shut down due to inability to deposit security fees. The heatmap's concentration of periodicals in only a few major colonial centers (Bombay, Calcutta, Delhi) reflects government licensing requirements and security deposit mandates that only established, government-friendly publications could afford. The sparse distribution across states shows how censorship actively suppressed regional press development."
  },
  { 
    id: 1,
    label: '1941-1950',
    edition: 'INDEPENDENCE EDITION',
    title: 'Freedom and Division', 
    context: 'Independence brought press freedom but partition disrupted regional publishing networks. Turbulent but transformative period.',
    analysis: "The modest increase in periodical numbers from 1900-1940 to 1941-1950 represents a transitional period marked by both press freedom and chaos. Following independence, publications were no longer subject to colonial censorship laws, but as the project notes, the newly formed Indian government faced instability and feared 'irresponsible' reporting during partition. Sardar Patel's <em>Press (Special Power) Bill (1947)</em> provided 'emergency legislation to meet with an emergency,' continuing restrictions under a new government. The <em>First Amendment (1951)</em> introduced 'reasonable restrictions' on free speech, creating uncertainty about what could be published. While the data shows moderate growth nationwide, the distribution remains concentrated in established centers, reflecting the transitional nature of this period—some freedom had arrived, but new forms of state control were being institutionalized."
  },
  { 
    id: 2,
    label: '1951-1960',
    edition: 'CONSTITUTION EDITION',
    title: 'Democratic Framework', 
    context: 'Constitutional framework enabled diverse publications. Federalism encouraged significant regional press growth across states.',
    analysis: "The significant growth in periodical counts during 1951-1960 reflects the constitutional framework established in India's independent democracy. The <em>Press (Objectionable Matters) Act 1951 (POMA)</em> 'puts a complete ban on pre-censorship' and 'repealed already existing acts that allowed for pre-censorship,' marking a watershed moment in Indian press history. The project notes that this act ensured 'only a court can decide whether a paper was guilty after an inquiry' and allowed for appeals to high courts and jury trials. With pre-censorship eliminated, small publishers could now operate without massive security deposits. The heatmap shows notable expansion beyond colonial centers—federalism and constitutional protections enabled regional press growth as states gained autonomy to support local publications in their regional languages."
  },
  { 
    id: 3,
    label: '1961-1970',
    edition: 'PROSPERITY EDITION',
    title: 'Growth and Expansion', 
    context: 'Agricultural prosperity and increased literacy rates drove periodical growth. Urban centers experienced rapid expansion.',
    analysis: "The dramatic increase in periodicals during 1961-1970 correlates with India's economic and social development post-independence. While the project focuses on censorship frameworks, the data visualization reveals that post-constitutional protections, combined with agricultural prosperity from the Green Revolution and increased literacy rates, created conditions for unprecedented press expansion. The distribution becomes more geographically balanced as urbanization and development spread to secondary and tertiary cities. The absence of major national censorship during this period (unlike the colonial era or Emergency period) allowed entrepreneurial publishers to establish local and regional newspapers. Maharashtra, Uttar Pradesh, and Delhi remain dominant due to existing infrastructure, but states like Madhya Pradesh, Karnataka, and Andhra Pradesh show significant growth for the first time."
  },
  { 
    id: 4,
    label: '1971-1980',
    edition: 'RESILIENCE EDITION',
    title: 'Press Survives', 
    context: 'Press showed resilience after emergency restrictions. Regional languages gained prominence in publishing landscape.',
    analysis: "This period exemplifies press resilience despite severe government restrictions. The <em>Emergency (1975-1977)</em> imposed direct censorship, but the heatmap reveals that total periodical numbers continued to grow, showing the press's adaptability. While large national publications faced government pressure and self-censorship, regional and vernacular publications proliferated, suggesting that 'regional languages gained prominence' in the publishing landscape as small publications sidestepped national-level restrictions. The growth reflects both governmental pressure (which may have limited some publications) and the emergence of decentralized, regional media that was harder for the center to control. The distribution remains relatively concentrated in established states, but secondary cities saw growth as the press adapted to political constraints."
  },
  { 
    id: 5,
    label: '1981-1990',
    edition: 'STAGNATION EDITION',
    title: 'Slower Growth', 
    context: 'Economic stagnation slowed growth rate but regional press continued development infrastructure.',
    analysis: "The slowdown in periodical growth during 1981-1990 reflects the economic stagnation of the pre-liberalization era. After the Emergency ended (1977), formal censorship restrictions were lifted, yet growth slowed due to economic constraints rather than legal restrictions. By this period, the project's focus on statutory censorship laws shows how censorship had become increasingly informal—through economic pressure, selective advertising withdrawal, and self-censorship rather than statutory restrictions. Publishers faced economic difficulties in establishing and maintaining publications during this economically constrained decade. The distribution pattern shows that established publications in major cities continued while expansion to smaller cities slowed, representing the transition between the controlled economy and the upcoming liberalization era."
  },
  { 
    id: 6,
    label: '1991-2000',
    edition: 'OPENING EDITION',
    title: 'Markets Awaken', 
    context: 'Market opening catalyzed exponential growth. New entrepreneurial opportunities in publishing flourished nationwide.',
    analysis: "The exponential growth of periodicals during 1991-2000 directly results from economic liberalization and the removal of governmental barriers to entry. With market opening, advertising became available from new commercial entities, Foreign Direct Investment flowed into media, and the project's framework of statutory censorship was increasingly replaced by market forces. The widespread geographic distribution of this growth—not just in metros but across secondary cities like Pune, Ahmedabad, Lucknow—shows how economic liberalization enabled nationwide press expansion. Publishers faced fewer statutory restrictions and could access capital more easily. The growth patterns suggest that without formal censorship (the project's core concern), the primary constraint on press expansion became economic rather than political, leading to explosive growth as India's economy opened up to global markets."
  },
  { 
    id: 7,
    label: '2001-2010',
    edition: 'DIGITAL EDITION',
    title: 'Internet Age Begins', 
    context: 'Internet penetration and digital media emergence. Highest absolute growth numbers in periodical publishing history.',
    analysis: "The unprecedented periodical counts during 2001-2010 reflect the convergence of press freedom (established constitutionally and legislatively) and the digital revolution. By this decade, the project's narrative of censorship and struggle is nearly complete—statutory restrictions exist only on the margins, and the dominant constraint is technological and economic. The rise of internet-based publications, the emergence of news websites, and the ability to publish without large capital investments accelerated publication counts dramatically. The geographic concentration persists in metros due to advertising revenue concentration, but secondary cities show substantial growth. The data visualizes the culmination of India's press freedom journey: from heavily censored colonial press (1900-1940) through constitutional protections (post-1951) to digitally empowered press (2001-2010)."
  },
  { 
    id: 8,
    label: '2011 onwards',
    edition: 'MODERN EDITION',
    title: 'Digital Transformation', 
    context: 'Print consolidation with digital publications emerging. Traditional periodicals adapting to new media landscape.',
    analysis: "The consolidation and slight decline in counted periodicals during 2011 onwards represents a shift in media landscape rather than a restriction on press freedom. The project's narrative of achieving constitutional protections and establishing press freedom is now complete—India's press is not restricted by the legislative frameworks that haunted 1900-1950. Instead, 2011+ shows print consolidation as digital media disrupts traditional publishing. Some print periodicals ceased publication as readers migrated online, while digital-only publications (often not captured in traditional periodical counts) proliferated. The geographic distribution remains concentrated in metros and developed regions where advertising revenue supports both print and digital operations. This decade represents not a failure of press freedom but rather the successful transformation of India's media ecosystem from one controlled by colonial censorship to one shaped by market forces and technological change."
  }
];

// GeoJSON state name mapping
const GEOJSON_MAPPING = {
  'Maharashtra': 'Maharashtra',
  'Uttar Pradesh': 'Uttar Pradesh',
  'Tamil Nadu': 'Tamil Nadu',
  'Kerala': 'Kerala',
  'Delhi': 'NCT of Delhi',
  'Rajasthan': 'Rajasthan',
  'Chhattisgarh': 'Chhattisgarh',
  'West Bengal': 'West Bengal',
  'Karnataka': 'Karnataka',
  'Andhra Pradesh': 'Andhra Pradesh',
  'Bihar': 'Bihar',
  'Gujarat': 'Gujarat',
  'Punjab': 'Punjab',
  'Madhya Pradesh': 'Madhya Pradesh',
  'Assam': 'Assam',
  'Puducherry': 'Puducherry',
  'Odisha': 'Odisha',
  'Haryana': 'Haryana',
  'Himachal Pradesh': 'Himachal Pradesh',
  'Tripura': 'Tripura',
  'Manipur': 'Manipur',
  'Chandigarh': 'Chandigarh',
  'Jammu and Kashmir': 'Jammu and Kashmir',
  'Jharkhand': 'Jharkhand',
  'Mizoram': 'Mizoram',
  'Nagaland': 'Nagaland',
  'Goa': 'Goa',
  'Meghalaya': 'Meghalaya',
  'Uttarakhand': 'Uttarakhand',
  'Andaman and Nicobar Islands': 'Andaman & Nicobar Island',
  'Sikkim': 'Sikkim',
  'Arunachal Pradesh': 'Arunachal Pradesh',
  'Lakshadweep': 'Lakshadweep',
  'Daman and Diu': 'Daman and Diu',
  'Dadra and Nagar Haveli': 'Dadra and Nagar Haveli'
};

let currentDecadeIndex = 0;

// India GeoJSON URL
const INDIA_GEOJSON_URL = 'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson';

let indiaGeoJSON = null;

// Fetch India GeoJSON
async function fetchGeoJSON() {
  try {
    const response = await fetch(INDIA_GEOJSON_URL);
    indiaGeoJSON = await response.json();
    return true;
  } catch (error) {
    console.error('Error fetching GeoJSON:', error);
    return false;
  }
}

// Get data for current decade
function getDecadeData(decadeIndex) {
  const locations = [];
  const values = [];
  const customData = [];
  
  const total = Object.values(STATE_DATA).reduce((sum, data) => sum + data[decadeIndex], 0);
  
  // Create ranked list for state rankings
  const rankedStates = Object.entries(STATE_DATA)
    .map(([name, data]) => ({ name, value: data[decadeIndex] }))
    .sort((a, b) => b.value - a.value);
  
  Object.entries(STATE_DATA).forEach(([stateName, data]) => {
    const geoName = GEOJSON_MAPPING[stateName] || stateName;
    const value = data[decadeIndex];
    const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : '0.00';
    const rank = rankedStates.findIndex(s => s.name === stateName) + 1;
    
    locations.push(geoName);
    values.push(value);
    customData.push({
      stateName: stateName,
      periodicals: value,
      percentage: percentage,
      rank: rank,
      total: total
    });
  });
  
  return { locations, values, customData, total };
}

// Create choropleth map with error handling
function createChoroplethMap(decadeIndex) {
  try {
    const decade = DECADES[decadeIndex];
    const { locations, values, customData, total } = getDecadeData(decadeIndex);
  
  const data = [{
    type: 'choropleth',
    geojson: indiaGeoJSON,
    locations: locations,
    z: values,
    featureidkey: 'properties.ST_NM',
    colorscale: [
      [0, '#F5E6D3'],
      [0.2, '#E8D4B8'],
      [0.4, '#D4AF37'],
      [0.6, '#C4A747'],
      [0.8, '#9B7E3A'],
      [1.0, '#7A6430']
    ],
    colorbar: {
      title: 'Periodicals',
      thickness: 15,
      len: 0.7,
      x: 1.02,
      xpad: 10,
      tickfont: { size: 12 }
    },
    marker: {
      line: {
        color: '#1A1A1A',
        width: 1.5
      }
    },
    hovertemplate: '<b>%{customdata.stateName}</b><br>' +
                   'Periodicals: <b>%{customdata.periodicals:,}</b><br>' +
                   'Share: <b>%{customdata.percentage}%</b><br>' +
                   'Rank: <b>#%{customdata.rank}</b><br>' +
                   '<extra></extra>',
    customdata: customData,
    hoverlabel: {
      bgcolor: '#F5E6D3',
      bordercolor: '#1A1A1A',
      font: { size: 14, family: 'Merriweather, Georgia, serif', color: '#2C1810' }
    }
  }];
  
  const layout = {
    title: {
      text: decade.edition + ': ' + decade.label,
      font: { size: 22, family: 'Playfair Display, Georgia, serif', weight: 700 },
      x: 0.5,
      xanchor: 'center'
    },
    geo: {
      fitbounds: 'geojson',
      visible: true,
      showland: true,
      landcolor: '#F0EBDE',
      showcountries: false,
      showlakes: false,
      showrivers: false,
      projection: {
        type: 'mercator'
      },
      center: {
        lat: 22.5,
        lon: 82.5
      }
    },
    margin: { t: 80, r: 100, b: 20, l: 20 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Merriweather, Georgia, serif' }
  };
  
  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToAdd: ['toImage'],
    modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'resetScale2d'],
    toImageButtonOptions: {
      format: 'png',
      filename: `india-periodicals-${decade.label}`,
      height: 800,
      width: 1200,
      scale: 2
    },
    displaylogo: false
  };
  
    Plotly.newPlot('choroplethMap', data, layout, config);
  } catch (error) {
    console.error('Error creating choropleth map:', error);
    const element = document.getElementById('choroplethMap');
    if (element) {
      element.innerHTML = '<p style="text-align: center; padding: 50px; color: #DB4545;">Error loading map. Please try again.</p>';
    }
  }
}

// Update map with new decade data with error handling
function updateChoroplethMap(decadeIndex) {
  try {
    const decade = DECADES[decadeIndex];
    const { locations, values, customData } = getDecadeData(decadeIndex);
  
  // Create the complete trace data
  const data = [{
    type: 'choropleth',
    geojson: indiaGeoJSON,
    locations: locations,
    z: values,
    featureidkey: 'properties.ST_NM',
    colorscale: [
      [0, '#F5E6D3'],
      [0.2, '#E8D4B8'],
      [0.4, '#D4AF37'],
      [0.6, '#C4A747'],
      [0.8, '#9B7E3A'],
      [1.0, '#7A6430']
    ],
    colorbar: {
      title: 'Periodicals',
      thickness: 15,
      len: 0.7,
      x: 1.02,
      xpad: 10,
      tickfont: { size: 12 }
    },
    marker: {
      line: {
        color: '#1A1A1A',
        width: 1.5
      }
    },
    hovertemplate: '<b>%{customdata.stateName}</b><br>' +
                   'Periodicals: <b>%{customdata.periodicals:,}</b><br>' +
                   'Share: <b>%{customdata.percentage}%</b><br>' +
                   'Rank: <b>#%{customdata.rank}</b><br>' +
                   '<extra></extra>',
    customdata: customData,
    hoverlabel: {
      bgcolor: '#F5E6D3',
      bordercolor: '#1A1A1A',
      font: { size: 14, family: 'Merriweather, Georgia, serif', color: '#2C1810' }
    }
  }];
  
  const layout = {
    title: {
      text: decade.edition + ': ' + decade.label,
      font: { size: 22, family: 'Playfair Display, Georgia, serif', weight: 700 },
      x: 0.5,
      xanchor: 'center'
    },
    geo: {
      fitbounds: 'geojson',
      visible: true,
      showland: true,
      landcolor: '#F0EBDE',
      showcountries: false,
      showlakes: false,
      showrivers: false,
      projection: {
        type: 'mercator'
      },
      center: {
        lat: 22.5,
        lon: 82.5
      }
    },
    margin: { t: 80, r: 100, b: 20, l: 20 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Merriweather, Georgia, serif' },
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    }
  };
  
  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToAdd: ['toImage'],
    modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'resetScale2d'],
    toImageButtonOptions: {
      format: 'png',
      filename: `india-periodicals-${decade.label}`,
      height: 800,
      width: 1200,
      scale: 2
    },
    displaylogo: false
  };
  
    // Use Plotly.react to update the entire plot with new data
    Plotly.react('choroplethMap', data, layout, config);
  } catch (error) {
    console.error('Error updating choropleth map:', error);
  }
}

// Initialize decade slider
function initDecadeSlider() {
  const slider = document.getElementById('decadeSlider');
  const labelsContainer = document.getElementById('sliderLabels');
  
  // Create labels for each decade
  DECADES.forEach((decade, index) => {
    const label = document.createElement('div');
    label.className = 'slider-label' + (index === currentDecadeIndex ? ' active' : '');
    label.textContent = decade.label.replace('-', '-');
    label.setAttribute('data-index', index);
    labelsContainer.appendChild(label);
  });
  
  // Add input event listener for real-time updates
  slider.addEventListener('input', (e) => {
    const index = parseInt(e.target.value);
    selectDecade(index);
  });
  
  // Set initial value
  slider.value = currentDecadeIndex;
}

// Select decade
function selectDecade(index) {
  currentDecadeIndex = index;
  
  // Update slider value
  const slider = document.getElementById('decadeSlider');
  if (slider) {
    slider.value = index;
  }
  
  // Update label highlighting
  document.querySelectorAll('.slider-label').forEach((label, i) => {
    label.classList.toggle('active', i === index);
  });
  
  updateDecadeInfo();
  updateChoroplethMap(index);
}

// Update decade info
function updateDecadeInfo() {
  const decade = DECADES[currentDecadeIndex];
  const { total } = getDecadeData(currentDecadeIndex);
  
  document.getElementById('decadeTitle').textContent = decade.edition + ' (' + decade.label + ')';
  document.getElementById('decadeContext').textContent = decade.context;
  
  // Get top 5 states
  const topStates = Object.entries(STATE_DATA)
    .map(([name, data]) => ({ name, value: data[currentDecadeIndex] }))
    .filter(s => s.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  
  const topStatesHtml = topStates.map((state, index) => `
    <div class="state-card">
      <div class="state-rank">#${index + 1}</div>
      <div class="state-name">${state.name}</div>
      <div class="state-value">${state.value.toLocaleString()}</div>
    </div>
  `).join('');
  
  document.getElementById('topStates').innerHTML = topStatesHtml;
  
  // Update analysis section
  updateAnalysisSection();
}

// Update analysis section with smooth fade transition
function updateAnalysisSection() {
  const decade = DECADES[currentDecadeIndex];
  const analysisText = document.getElementById('analysisText');
  const analysisDate = document.getElementById('analysisDate');
  
  // Fade out current text
  analysisText.classList.add('fade-out');
  
  // Wait for fade out, then update content and fade in
  setTimeout(() => {
    analysisText.innerHTML = decade.analysis;
    analysisDate.textContent = decade.display || decade.edition + ' • ' + decade.label;
    
    // Remove fade-out class to fade in
    analysisText.classList.remove('fade-out');
  }, 300);
}

// Initialize application
async function initApp() {
  const success = await fetchGeoJSON();
  if (!success) {
    document.getElementById('choroplethMap').innerHTML = '<p style="text-align: center; padding: 50px; color: #ff0000;">Error loading map data. Please refresh the page.</p>';
    return;
  }
  
  initDecadeSlider();
  updateDecadeInfo();
  createChoroplethMap(currentDecadeIndex);
  
  // Initialize analysis section
  updateAnalysisSection();
}

// Modal functions
function openModal() {
  openModalByNumber(1);
}

function closeModal() {
  closeAllModals();
}



// Add keyboard support for closing modal
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const modal = document.getElementById('modalOverlay');
    if (modal.classList.contains('active')) {
      closeModal();
    }
  }
});

// Start the app
initApp();

// Add simple click handlers to cards
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.dashboard-card');
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const modalNum = this.getAttribute('data-modal');
      if (modalNum) {
        openModalByNumber(parseInt(modalNum));
      }
    });
  });
  
  // Add overlay click handlers
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeAllModals();
      }
    });
  });
});

function openModalByNumber(num) {
  closeAllModals();
  
  // Map card numbers to actual modal IDs in HTML
  const modalMapping = {
    1: 'modalOverlay',    // Card 1 → Regional Distribution
    2: 'modalOverlay2',   // Card 2 → Language Distribution
    3: 'modalOverlay7',   // Card 3 → Registration (uses modalOverlay7 in HTML)
    4: 'modalOverlay3',   // Card 4 → Literacy (uses modalOverlay3 in HTML)
    5: 'modalOverlay4',   // Card 5 → Survival (uses modalOverlay4 in HTML)
    6: 'modalOverlay5',   // Card 6 → Frequency (uses modalOverlay5 in HTML)
    7: 'modalOverlay6',   // Card 7 → Foreign Languages (uses modalOverlay6 in HTML)
    8: 'modalOverlay8'    // Card 8 → Discourse Analysis (Bag of Words)
  };
  
  const modalId = modalMapping[num];
  const modal = document.getElementById(modalId);
  
  if (modal) {
    // Prevent body scroll when modal open
    document.body.style.overflow = 'hidden';
    modal.classList.add('active');
    
    // Render charts for each card
    if (num === 2) renderLanguageChartsInstant();
    if (num === 3) renderRegistrationChartsInstant();
    if (num === 4) renderLiteracyChartsInstant();
    if (num === 5) renderSurvivalChartsInstant();
    if (num === 6) renderFrequencyChartsInstant();
    if (num === 7) renderForeignLanguageChartsInstant();
    if (num === 8) renderWordCloudInstant();
  }
}

function closeAllModals() {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    modal.classList.remove('active');
  });
  // Restore body scroll
  document.body.style.overflow = 'auto';
}

// ===== TAB NAVIGATION SYSTEM =====
function showTab(cardNumber, tabNumber) {
  // Hide all tabs for this card
  const allTabs = document.querySelectorAll(`#modalOverlay${cardNumber === 1 ? '' : cardNumber} .tab-content`);
  allTabs.forEach(tab => {
    tab.style.display = 'none';
  });
  
  // Remove active class from all buttons
  const allButtons = document.querySelectorAll(`#modalOverlay${cardNumber === 1 ? '' : cardNumber} .tab-button`);
  allButtons.forEach(button => {
    button.classList.remove('active');
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(`card${cardNumber}-tab${tabNumber}`);
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }
  
  // Add active class to clicked button
  const buttons = Array.from(allButtons);
  if (buttons[tabNumber - 1]) {
    buttons[tabNumber - 1].classList.add('active');
  }
  
  // Trigger chart resize for Plotly charts if needed
  setTimeout(() => {
    if (window.Plotly) {
      const chartIds = [
        'choroplethMap', 'languagePieChart', 'languageTimelineChart', 'languagesByStateChart',
        'literacyScatterChart', 'literacyBarChart', 'survivalBarChart', 'survivalMapChart',
        'frequencyChart', 'frequencyStateChart', 'frequencyTimelineChart',
        'foreignLanguageChart', 'foreignLanguageTimelineChart',
        'registrationChart', 'registrationTimelineChart'
      ];
      chartIds.forEach(id => {
        const element = document.getElementById(id);
        if (element && element.offsetParent !== null) {
          Plotly.Plots.resize(id);
        }
      });
    }
  }, 100);
}

// ===== CARD 2: LANGUAGE DISTRIBUTION =====

const LANGUAGE_TIMELINE_DATA = [
  { era: '1947-1951: Pre-POMA', english: 25, hindi: 45, regional: 20, bilingual: 10, context: 'Colonial English legacy remains strong' },
  { era: '1951-1960: Constitution', english: 20, hindi: 50, regional: 22, bilingual: 8, context: 'Hindi ascendant as national language' },
  { era: '1960-1975: Linguistic States', english: 18, hindi: 48, regional: 26, bilingual: 8, context: 'State reorganization enables regional growth' },
  { era: '1975-1977: Emergency', english: 16, hindi: 50, regional: 28, bilingual: 6, context: 'Vernacular press shows resilience' },
  { era: '1977-1991: Recovery', english: 18, hindi: 46, regional: 30, bilingual: 6, context: 'Regional languages consolidate gains' },
  { era: '1991-2011: Liberalization', english: 19, hindi: 42, regional: 28, bilingual: 11, context: 'Market enables bilingual publications' },
  { era: '2011+: Digital Age', english: 14.61, hindi: 37.49, regional: 40.25, bilingual: 7.65, context: 'Current state: Linguistic diversity' }
];

let currentLanguageView = 'pie';
let selectedLanguage = null;

const LANGUAGE_DATA = [
  { language: 'Hindi', periodicals: 43697, share: 37.49, daily: 5936, weekly: 18704, monthly: 10641 },
  { language: 'English', periodicals: 17029, share: 14.61, daily: 1258, weekly: 2305, monthly: 6882 },
  { language: 'Bilingual', periodicals: 8923, share: 7.65, daily: 374, weekly: 1934, monthly: 3718 },
  { language: 'Marathi', periodicals: 7384, share: 6.33, daily: 991, weekly: 3805, monthly: 1507 },
  { language: 'Urdu', periodicals: 5809, share: 4.98, daily: 1433, weekly: 2255, monthly: 1334 },
  { language: 'Tamil', periodicals: 5033, share: 4.32, daily: 508, weekly: 1619, monthly: 1852 },
  { language: 'Gujarati', periodicals: 4976, share: 4.27, daily: 788, weekly: 2084, monthly: 1458 },
  { language: 'Bengali', periodicals: 4641, share: 3.98, daily: 310, weekly: 1771, monthly: 1661 },
  { language: 'Kannada', periodicals: 4416, share: 3.79, daily: 323, weekly: 1800, monthly: 1618 },
  { language: 'Telugu', periodicals: 4393, share: 3.77, daily: 457, weekly: 1380, monthly: 1684 },
  { language: 'Malayalam', periodicals: 3276, share: 2.81, daily: 261, weekly: 1339, monthly: 1080 },
  { language: 'Others', periodicals: 6954, share: 5.97, daily: 745, weekly: 2494, monthly: 2140 }
];

const LANGUAGES_BY_STATE = [
  { state: 'Odisha', languages: 76 },
  { state: 'Delhi', languages: 39 },
  { state: 'Maharashtra', languages: 33 },
  { state: 'West Bengal', languages: 31 },
  { state: 'Assam', languages: 25 },
  { state: 'Uttar Pradesh', languages: 24 },
  { state: 'Tamil Nadu', languages: 24 },
  { state: 'Kerala', languages: 22 },
  { state: 'Karnataka', languages: 22 },
  { state: 'Manipur', languages: 22 }
];

// INSTANT RENDER FUNCTIONS - No delays, direct Plotly calls
function renderLanguageChartsInstant() {
  try {
    // Immediately render pre-calculated chart data
    if (!CHART_CACHE.languagePie) {
      CHART_CACHE.languagePie = buildLanguagePieData();
      CHART_CACHE.languageTimeline = buildLanguageTimelineData();
      CHART_CACHE.languageState = buildLanguageStateData();
    }
    
    const pieElement = document.getElementById('languagePieChart');
    const timelineElement = document.getElementById('languageTimelineChart');
    const stateElement = document.getElementById('languagesByStateChart');
    
    if (pieElement) Plotly.newPlot('languagePieChart', CHART_CACHE.languagePie.data, CHART_CACHE.languagePie.layout, {responsive: true, displayModeBar: false});
    if (timelineElement) Plotly.newPlot('languageTimelineChart', CHART_CACHE.languageTimeline.data, CHART_CACHE.languageTimeline.layout, {responsive: true, displayModeBar: false});
    if (stateElement) Plotly.newPlot('languagesByStateChart', CHART_CACHE.languageState.data, CHART_CACHE.languageState.layout, {responsive: true, displayModeBar: false});
  } catch (error) {
    console.error('Error rendering language charts:', error);
  }
}

function buildLanguagePieData() {
  const data = [{
    type: 'pie',
    labels: LANGUAGE_DATA.map(d => d.language),
    values: LANGUAGE_DATA.map(d => d.periodicals),
    marker: {
      colors: CHART_COLORS.fills
    },
    hovertemplate: '<b>%{label}</b><br>Periodicals: <b>%{value:,}</b><br>Share: <b>%{customdata}%</b><br><extra></extra>',
    customdata: LANGUAGE_DATA.map(d => d.share.toFixed(2)),
    textinfo: 'label+percent',
    textposition: 'auto',
    hoverlabel: PLOTLY_HOVER_CONFIG
  }];
  const layout = {
    ...PLOTLY_LAYOUT_DEFAULTS,
    title: {text: 'Press Language Distribution', font: {size: 20, family: 'Playfair Display, Georgia, serif', weight: 700}},
    showlegend: true,
    legend: {orientation: 'v', x: 1.05, y: 0.5},
    height: 500
  };
  return {data, layout};
}

function buildLanguageTimelineData() {
  const traces = [
    {type: 'scatter', mode: 'lines+markers', name: 'Hindi', x: LANGUAGE_TIMELINE_DATA.map(d => d.era.split(':')[0]), y: LANGUAGE_TIMELINE_DATA.map(d => d.hindi), line: {color: CHART_COLORS.primary, width: 3}, marker: {size: 8, color: CHART_COLORS.primary}, hovertemplate: '<b>%{x}</b><br>Hindi: <b>%{y}%</b><br>%{customdata}<extra></extra>', customdata: LANGUAGE_TIMELINE_DATA.map(d => d.context), hoverlabel: PLOTLY_HOVER_CONFIG},
    {type: 'scatter', mode: 'lines+markers', name: 'English', x: LANGUAGE_TIMELINE_DATA.map(d => d.era.split(':')[0]), y: LANGUAGE_TIMELINE_DATA.map(d => d.english), line: {color: CHART_COLORS.secondary, width: 3}, marker: {size: 8, color: CHART_COLORS.secondary}, hovertemplate: '<b>%{x}</b><br>English: <b>%{y}%</b><br>%{customdata}<extra></extra>', customdata: LANGUAGE_TIMELINE_DATA.map(d => d.context), hoverlabel: PLOTLY_HOVER_CONFIG},
    {type: 'scatter', mode: 'lines+markers', name: 'Regional', x: LANGUAGE_TIMELINE_DATA.map(d => d.era.split(':')[0]), y: LANGUAGE_TIMELINE_DATA.map(d => d.regional), line: {color: CHART_COLORS.tertiary, width: 3}, marker: {size: 8, color: CHART_COLORS.tertiary}, hovertemplate: '<b>%{x}</b><br>Regional: <b>%{y}%</b><br>%{customdata}<extra></extra>', customdata: LANGUAGE_TIMELINE_DATA.map(d => d.context), hoverlabel: PLOTLY_HOVER_CONFIG},
    {type: 'scatter', mode: 'lines+markers', name: 'Bilingual', x: LANGUAGE_TIMELINE_DATA.map(d => d.era.split(':')[0]), y: LANGUAGE_TIMELINE_DATA.map(d => d.bilingual), line: {color: CHART_COLORS.quaternary, width: 3}, marker: {size: 8, color: CHART_COLORS.quaternary}, hovertemplate: '<b>%{x}</b><br>Bilingual: <b>%{y}%</b><br>%{customdata}<extra></extra>', customdata: LANGUAGE_TIMELINE_DATA.map(d => d.context), hoverlabel: PLOTLY_HOVER_CONFIG}
  ];
  const layout = {
    ...PLOTLY_LAYOUT_DEFAULTS,
    title: {text: 'Post-Independence Language Distribution Evolution', font: {size: 20, family: 'Playfair Display, Georgia, serif', weight: 700}, y: 0.95, x: 0.5, xanchor: 'center', yanchor: 'top'},
    xaxis: {tickangle: -45, tickfont: {size: 10}},
    yaxis: {title: 'Share (%)', range: [0, 60]},
    margin: {l: 60, r: 40, t: 80, b: 100},
    height: 500,
    showlegend: true,
    legend: {orientation: 'h', x: 0.5, xanchor: 'center', y: -0.15},
    annotations: [{x: '1951-1960', y: 50, text: 'POMA 1951', showarrow: true, arrowhead: 2, ax: 0, ay: -40}, {x: '1975-1977', y: 28, text: 'Emergency', showarrow: true, arrowhead: 2, ax: 0, ay: 40}]
  };
  return {data: traces, layout};
}

function buildLanguageStateData() {
  const data = [{
    type: 'bar',
    x: LANGUAGES_BY_STATE.map(d => d.languages),
    y: LANGUAGES_BY_STATE.map(d => d.state),
    orientation: 'h',
    marker: {
      color: LANGUAGES_BY_STATE.map(d => d.languages),
      colorscale: [[0, '#F5E6D3'], [0.5, CHART_COLORS.accent], [1.0, '#7A6430']],
      line: {color: '#1A1A1A', width: 1}
    },
    hovertemplate: '<b>%{y}</b><br>Languages: <b>%{x}</b><br><extra></extra>',
    hoverlabel: PLOTLY_HOVER_CONFIG
  }];
  const layout = {
    ...PLOTLY_LAYOUT_DEFAULTS,
    title: {text: 'Languages Covered by State (Top 10)', font: {size: 20, family: 'Playfair Display, Georgia, serif', weight: 700}},
    xaxis: {title: 'Number of Languages'},
    yaxis: {autorange: 'reversed'},
    margin: {l: 120, r: 80, t: 80, b: 60},
    height: 500
  };
  return {data, layout};
}

// OLD FUNCTIONS REMOVED - Now using instant render functions with pre-calculated data

function openModal2() {
  openModalByNumber(2);
}

function closeModal2() {
  closeAllModals();
}



// ===== CARD 3: LITERACY & ACCESS =====

let currentLiteracyView = 'scatter';

const LITERACY_DATA = [
  { state: 'Delhi', literacy_rate: 86.3, titles_per_1000: 1.003, total_active: 14504, region: 'North' },
  { state: 'Chandigarh', literacy_rate: 86.4, titles_per_1000: 0.493, total_active: 444, region: 'North' },
  { state: 'Uttarakhand', literacy_rate: 79.6, titles_per_1000: 0.269, total_active: 2166, region: 'North' },
  { state: 'Mizoram', literacy_rate: 91.6, titles_per_1000: 0.186, total_active: 185, region: 'Northeast' },
  { state: 'Andaman Nicobar', literacy_rate: 86.3, titles_per_1000: 0.254, total_active: 79, region: 'Other' },
  { state: 'Sikkim', literacy_rate: 82.2, titles_per_1000: 0.220, total_active: 108, region: 'Northeast' },
  { state: 'Pondicherry', literacy_rate: 86.5, titles_per_1000: 0.149, total_active: 160, region: 'South' },
  { state: 'Maharashtra', literacy_rate: 82.9, titles_per_1000: 0.165, total_active: 15437, region: 'West' },
  { state: 'Madhya Pradesh', literacy_rate: 70.6, titles_per_1000: 0.174, total_active: 8957, region: 'Central' },
  { state: 'Rajasthan', literacy_rate: 67.1, titles_per_1000: 0.138, total_active: 6384, region: 'North' },
  { state: 'Punjab', literacy_rate: 76.7, titles_per_1000: 0.138, total_active: 2937, region: 'North' },
  { state: 'Tamil Nadu', literacy_rate: 80.3, titles_per_1000: 0.127, total_active: 7397, region: 'South' },
  { state: 'Karnataka', literacy_rate: 75.6, titles_per_1000: 0.129, total_active: 5998, region: 'South' },
  { state: 'Kerala', literacy_rate: 93.9, titles_per_1000: 0.132, total_active: 4144, region: 'South' },
  { state: 'Uttar Pradesh', literacy_rate: 69.7, titles_per_1000: 0.131, total_active: 18324, region: 'North' },
  { state: 'West Bengal', literacy_rate: 77.1, titles_per_1000: 0.100, total_active: 7043, region: 'East' },
  { state: 'Gujarat', literacy_rate: 79.3, titles_per_1000: 0.111, total_active: 5336, region: 'West' },
  { state: 'Andhra Pradesh', literacy_rate: 67.7, titles_per_1000: 0.117, total_active: 6735, region: 'South' },
  { state: 'Haryana', literacy_rate: 76.6, titles_per_1000: 0.104, total_active: 2029, region: 'North' },
  { state: 'Jammu & Kashmir', literacy_rate: 68.7, titles_per_1000: 0.114, total_active: 989, region: 'North' },
  { state: 'Chhattisgarh', literacy_rate: 71.0, titles_per_1000: 0.046, total_active: 851, region: 'Central' },
  { state: 'Assam', literacy_rate: 73.2, titles_per_1000: 0.034, total_active: 779, region: 'Northeast' },
  { state: 'Himachal Pradesh', literacy_rate: 83.8, titles_per_1000: 0.058, total_active: 333, region: 'North' },
  { state: 'Manipur', literacy_rate: 79.8, titles_per_1000: 0.099, total_active: 215, region: 'Northeast' },
  { state: 'Jharkhand', literacy_rate: 67.6, titles_per_1000: 0.009, total_active: 206, region: 'East' },
  { state: 'Odisha', literacy_rate: 73.5, titles_per_1000: 0.070, total_active: 2170, region: 'East' },
  { state: 'Meghalaya', literacy_rate: 75.5, titles_per_1000: 0.029, total_active: 65, region: 'Northeast' },
  { state: 'Nagaland', literacy_rate: 80.1, titles_per_1000: 0.013, total_active: 22, region: 'Northeast' },
  { state: 'Arunachal Pradesh', literacy_rate: 67.0, titles_per_1000: 0.021, total_active: 20, region: 'Northeast' },
  { state: 'Daman & Diu', literacy_rate: 87.1, titles_per_1000: 0.060, total_active: 12, region: 'Other' },
  { state: 'Dadar & Nagar Hav', literacy_rate: 77.7, titles_per_1000: 0.080, total_active: 21, region: 'Other' },
  { state: 'Lakshadweep', literacy_rate: 92.3, titles_per_1000: 0.140, total_active: 7, region: 'Other' },
  { state: 'Tripura', literacy_rate: 87.8, titles_per_1000: 0.042, total_active: 136, region: 'Northeast' },
  { state: 'Bihar', literacy_rate: 63.8, titles_per_1000: 0.033, total_active: 2014, region: 'East' },
  { state: 'Goa', literacy_rate: 87.4, titles_per_1000: 0.071, total_active: 217, region: 'West' }
];

function renderLiteracyChartsInstant() {
  try {
    if (!CHART_CACHE.literacyScatter) {
      CHART_CACHE.literacyScatter = buildLiteracyScatterData();
      CHART_CACHE.literacyBar = buildLiteracyBarData();
    }
    
    const scatterElement = document.getElementById('literacyScatterChart');
    const barElement = document.getElementById('literacyBarChart');
    
    if (scatterElement) Plotly.newPlot('literacyScatterChart', CHART_CACHE.literacyScatter.data, CHART_CACHE.literacyScatter.layout, {responsive: true, displayModeBar: false});
    if (barElement) Plotly.newPlot('literacyBarChart', CHART_CACHE.literacyBar.data, CHART_CACHE.literacyBar.layout, {responsive: true, displayModeBar: false});
  } catch (error) {
    console.error('Error rendering literacy charts:', error);
  }
}

function buildLiteracyScatterData() {
  const regionColors = {
    'North': CHART_COLORS.primary,
    'South': CHART_COLORS.secondary,
    'East': CHART_COLORS.tertiary,
    'West': CHART_COLORS.quaternary,
    'Northeast': '#D2BA4C',
    'Central': '#964325',
    'Other': '#ECEBD5'
  };
  const data = [{
    type: 'scatter',
    mode: 'markers+text',
    x: LITERACY_DATA.map(d => d.literacy_rate),
    y: LITERACY_DATA.map(d => d.titles_per_1000),
    text: LITERACY_DATA.map(d => {
      const outliers = ['Delhi', 'Kerala', 'Bihar', 'Jharkhand', 'Uttarakhand', 'Mizoram'];
      return outliers.includes(d.state) ? d.state : '';
    }),
    textposition: 'top center',
    textfont: {size: 10},
    marker: {
      size: LITERACY_DATA.map(d => Math.sqrt(d.total_active) / 3 + 5),
      color: LITERACY_DATA.map(d => regionColors[d.region]),
      line: {color: '#1A1A1A', width: 1},
      opacity: 0.8
    },
    hovertemplate: '<b>%{customdata.state}</b><br>Region: <b>%{customdata.region}</b><br>Literacy Rate: <b>%{x}%</b><br>Titles per 1000: <b>%{y:.3f}</b><br>Total Active: <b>%{customdata.total_active:,}</b><br><extra></extra>',
    customdata: LITERACY_DATA.map(d => ({state: d.state, region: d.region, total_active: d.total_active})),
    hoverlabel: PLOTLY_HOVER_CONFIG
  }];
  const validData = LITERACY_DATA.filter(d => d.titles_per_1000 > 0);
  const xMean = validData.reduce((sum, d) => sum + d.literacy_rate, 0) / validData.length;
  const yMean = validData.reduce((sum, d) => sum + d.titles_per_1000, 0) / validData.length;
  const slope = validData.reduce((sum, d) => sum + (d.literacy_rate - xMean) * (d.titles_per_1000 - yMean), 0) / validData.reduce((sum, d) => sum + Math.pow(d.literacy_rate - xMean, 2), 0);
  const intercept = yMean - slope * xMean;
  const trendlineX = [63, 95]; const trendlineY = trendlineX.map(x => slope * x + intercept);
  data.push({type: 'scatter', mode: 'lines', x: trendlineX, y: trendlineY, line: {color: '#7A6430', width: 2, dash: 'dash'}, name: 'Trendline', hoverinfo: 'skip', showlegend: false});
  const layout = {
    ...PLOTLY_LAYOUT_DEFAULTS,
    title: {text: 'Literacy Rate vs. Information Accessibility (All 35 States)', font: {size: 22, family: 'Playfair Display, Georgia, serif', weight: 700}},
    xaxis: {title: 'Literacy Rate (%)', range: [62, 96]},
    yaxis: {title: 'Titles per 1000 Literate Persons', range: [-0.05, 1.1]},
    margin: {l: 80, r: 40, t: 80, b: 80},
    height: 600
  };
  return {data, layout};
}

function buildLiteracyBarData() {
  const sortedData = [...LITERACY_DATA].sort((a, b) => b.literacy_rate - a.literacy_rate);
  const colors = sortedData.map(d => {
    if (d.literacy_rate >= 86) return CHART_COLORS.primary;
    if (d.literacy_rate >= 75) return CHART_COLORS.quaternary;
    if (d.literacy_rate >= 70) return CHART_COLORS.secondary;
    return '#DB4545';
  });
  const data = [{
    type: 'bar', y: sortedData.map(d => d.state), x: sortedData.map(d => d.literacy_rate), orientation: 'h',
    marker: {color: colors, line: {color: '#1A1A1A', width: 1}},
    text: sortedData.map(d => d.literacy_rate.toFixed(1) + '% | ' + d.titles_per_1000.toFixed(3) + ' titles/1000'), textposition: 'outside', textfont: {size: 9},
    hovertemplate: '<b>%{y}</b><br>Literacy Rate: <b>%{x}%</b><br>Titles per 1000: <b>%{customdata.titles:,.3f}</b><br>Total Active: <b>%{customdata.total:,}</b><br><extra></extra>',
    customdata: sortedData.map(d => ({titles: d.titles_per_1000, total: d.total_active})),
    hoverlabel: {bgcolor: '#F5E6D3', bordercolor: '#1A1A1A', font: {size: 13, family: 'Merriweather, Georgia, serif', color: '#2C1810'}}
  }];
  const layout = {
    ...PLOTLY_LAYOUT_DEFAULTS,
    title: {text: 'Literacy Rates by State (All 35 States)', font: {size: 22, family: 'Playfair Display, Georgia, serif', weight: 700}},
    xaxis: {title: 'Literacy Rate (%)', range: [60, 100]},
    yaxis: {autorange: 'reversed'},
    margin: {l: 140, r: 180, t: 80, b: 60},
    height: 600,
    annotations: [{
      x: 95,
      y: -2,
      text: 'Colors: Elite (>86%) | High (75-85%) | Medium (70-74%) | Low (<70%)',
      showarrow: false,
      font: {size: 11, color: '#2C1810'}
    }]
  };
  return {data, layout};
}

// OLD LITERACY CHART FUNCTIONS REMOVED - Using instant render

function openModal3() {
  openModalByNumber(3);
}

function closeModal3() {
  closeAllModals();
}



// ===== CARD 4: SURVIVAL RATES =====

let currentSurvivalView = 'bar';

const SURVIVAL_DATA = [
  { state: 'Lakshadweep', survival: 50.00, total: 4, active: 2 },
  { state: 'Uttarakhand', survival: 48.01, total: 2239, active: 1075 },
  { state: 'Sikkim', survival: 45.00, total: 38, active: 17 },
  { state: 'Tripura', survival: 36.36, total: 58, active: 21 },
  { state: 'Bihar', survival: 28.92, total: 6961, active: 2014 },
  { state: 'West Bengal', survival: 27.92, total: 3865, active: 1079 },
  { state: 'Jharkhand', survival: 26.89, total: 766, active: 206 },
  { state: 'Meghalaya', survival: 26.74, total: 243, active: 65 },
  { state: 'Rajasthan', survival: 26.54, total: 24052, active: 6384 },
  { state: 'Gujarat', survival: 26.35, total: 20249, active: 5336 },
  { state: 'Assam', survival: 26.05, total: 2991, active: 779 },
  { state: 'Andhra Pradesh', survival: 25.64, total: 26261, active: 6735 },
  { state: 'Madhya Pradesh', survival: 24.54, total: 36505, active: 8957 },
  { state: 'Uttar Pradesh', survival: 23.94, total: 76535, active: 18324 },
  { state: 'Delhi', survival: 23.35, total: 62117, active: 14504 },
  { state: 'Chhattisgarh', survival: 23.04, total: 3694, active: 851 },
  { state: 'Tamil Nadu', survival: 22.43, total: 32987, active: 7397 },
  { state: 'Manipur', survival: 20.97, total: 1025, active: 215 },
  { state: 'Arunachal Pradesh', survival: 20.61, total: 97, active: 20 },
  { state: 'Haryana', survival: 19.29, total: 10520, active: 2029 },
  { state: 'Nagaland', survival: 18.96, total: 116, active: 22 },
  { state: 'Himachal Pradesh', survival: 18.84, total: 1768, active: 333 },
  { state: 'Mizoram', survival: 16.89, total: 1095, active: 185 },
  { state: 'Karnataka', survival: 16.88, total: 35534, active: 5998 },
  { state: 'Goa', survival: 16.78, total: 1293, active: 217 },
  { state: 'Chandigarh', survival: 16.76, total: 2650, active: 444 },
  { state: 'Punjab', survival: 16.62, total: 17670, active: 2937 },
  { state: 'Maharashtra', survival: 15.80, total: 97704, active: 15437 },
  { state: 'Kerala', survival: 14.29, total: 29006, active: 4144 },
  { state: 'Pondicherry', survival: 14.01, total: 1142, active: 160 },
  { state: 'Odisha', survival: 12.99, total: 16706, active: 2170 }
];

const NATIONAL_AVG = 21.53;

function renderSurvivalChartsInstant() {
  try {
    if (!CHART_CACHE.survivalBar) {
      CHART_CACHE.survivalBar = buildSurvivalBarData();
    }
    
    const barElement = document.getElementById('survivalBarChart');
    if (barElement) {
      Plotly.newPlot('survivalBarChart', CHART_CACHE.survivalBar.data, CHART_CACHE.survivalBar.layout, {responsive: true, displayModeBar: false});
    }
    // Geographic view is now text-based HTML - no chart rendering needed
  } catch (error) {
    console.error('Error rendering survival charts:', error);
  }
}

function buildSurvivalBarData() {
  const sortedData = [...SURVIVAL_DATA].sort((a, b) => b.survival - a.survival);
  const data = [{
    type: 'bar',
    y: sortedData.map(d => d.state),
    x: sortedData.map(d => d.survival),
    orientation: 'h',
    marker: {
      color: sortedData.map(d => d.survival),
      colorscale: [[0, '#DB4545'], [0.5, CHART_COLORS.secondary], [1.0, CHART_COLORS.primary]],
      line: {color: '#1A1A1A', width: 1}
    },
    text: sortedData.map(d => d.survival.toFixed(1) + '%'),
    textposition: 'outside',
    hovertemplate: '<b>%{y}</b><br>Survival Rate: <b>%{x:.2f}%</b><br>Total: <b>%{customdata.total:,}</b><br>Active: <b>%{customdata.active:,}</b><br><extra></extra>',
    customdata: sortedData.map(d => ({total: d.total, active: d.active})),
    hoverlabel: PLOTLY_HOVER_CONFIG
  }];
  const layout = {
    ...PLOTLY_LAYOUT_DEFAULTS,
    title: {text: 'Periodical Survival Rates by State (30+ States)', font: {size: 22, family: 'Playfair Display, Georgia, serif', weight: 700}},
    xaxis: {title: 'Survival Rate (%)', range: [0, 55]},
    yaxis: {autorange: 'reversed'},
    margin: {l: 120, r: 80, t: 80, b: 60},
    height: 600,
    shapes: [{
      type: 'line',
      x0: 21.53,
      x1: 21.53,
      y0: -0.5,
      y1: sortedData.length - 0.5,
      line: {color: '#2C1810', width: 2, dash: 'dash'}
    }],
    annotations: [{
      x: 21.53,
      y: -1,
      text: 'National Avg: 21.53%',
      showarrow: false,
      xshift: 0,
      yshift: -10,
      font: {size: 11, color: '#2C1810', family: 'Merriweather, Georgia, serif'}
    }]
  };
  return {data, layout};
}

function buildSurvivalMapData() {
  // Return empty - geographic view is now text-based HTML, not a chart
  return {data: [], layout: {}};
}

// OLD SURVIVAL CHART FUNCTIONS REMOVED - Using instant render

function openModal4() {
  openModalByNumber(4);
}

function closeModal4() {
  closeAllModals();
}



// ===== CARD 5: PUBLICATION FREQUENCY =====

const CENSORSHIP_CORRELATION_DATA = [
  { period: '1857-1910: Press Act Era', daily: 5, weekly: 35, monthly: 60, context: 'Security deposits forced weekly/monthly' },
  { period: '1910-1947: Vernacular Act', daily: 8, weekly: 40, monthly: 52, context: 'Dailies most vulnerable to censorship' },
  { period: '1951-1975: POMA Era', daily: 14, weekly: 38, monthly: 48, context: 'Pre-censorship ban, but habits persist' },
  { period: '1975-1977: Emergency', daily: 10, weekly: 42, monthly: 48, context: 'Dailies shifted to weekly schedules' },
  { period: '1977-1991: Post-Emergency', daily: 12, weekly: 41, monthly: 47, context: 'Economic barriers keep weekly dominant' },
  { period: '1991+: Liberalization', daily: 12, weekly: 31, monthly: 57, context: 'Market-driven, not law-driven' }
];

let currentFrequencyView = 'language';

const PERIODICITY_BY_STATE = [
  { state: 'Uttar Pradesh', daily: 2712, weekly: 8983, monthly: 3617 },
  { state: 'Maharashtra', daily: 1517, weekly: 6114, monthly: 4449 },
  { state: 'Andhra Pradesh', daily: 1527, weekly: 1254, monthly: 2675 },
  { state: 'Delhi', daily: 1007, weekly: 2724, monthly: 6333 },
  { state: 'Madhya Pradesh', daily: 1159, weekly: 3810, monthly: 2710 },
  { state: 'Bihar', daily: 494, weekly: 795, monthly: 464 },
  { state: 'Tamil Nadu', daily: 631, weekly: 1020, monthly: 3885 },
  { state: 'Kerala', daily: 409, weekly: 437, monthly: 2329 }
];

function renderFrequencyChartsInstant() {
  try {
    if (!CHART_CACHE.frequencyLang) {
      CHART_CACHE.frequencyLang = buildFrequencyLanguageData();
      CHART_CACHE.frequencyState = buildFrequencyStateData();
      CHART_CACHE.frequencyTimeline = buildFrequencyTimelineData();
    }
    
    const langElement = document.getElementById('frequencyChart');
    const stateElement = document.getElementById('frequencyStateChart');
    const timelineElement = document.getElementById('frequencyTimelineChart');
    
    if (langElement) Plotly.newPlot('frequencyChart', CHART_CACHE.frequencyLang.data, CHART_CACHE.frequencyLang.layout, {responsive: true, displayModeBar: false});
    if (stateElement) Plotly.newPlot('frequencyStateChart', CHART_CACHE.frequencyState.data, CHART_CACHE.frequencyState.layout, {responsive: true, displayModeBar: false});
    if (timelineElement) Plotly.newPlot('frequencyTimelineChart', CHART_CACHE.frequencyTimeline.data, CHART_CACHE.frequencyTimeline.layout, {responsive: true, displayModeBar: false});
  } catch (error) {
    console.error('Error rendering frequency charts:', error);
  }
}

function buildFrequencyLanguageData() {
  const languages = LANGUAGE_DATA.filter(d => d.language !== 'Others').map(d => d.language);
  const data = [
    {type: 'bar', name: 'Daily', x: LANGUAGE_DATA.filter(d => d.language !== 'Others').map(d => d.daily), y: languages, orientation: 'h', marker: {color: CHART_COLORS.primary, line: {color: '#1A1A1A', width: 1}}, hoverlabel: PLOTLY_HOVER_CONFIG},
    {type: 'bar', name: 'Weekly', x: LANGUAGE_DATA.filter(d => d.language !== 'Others').map(d => d.weekly), y: languages, orientation: 'h', marker: {color: CHART_COLORS.secondary, line: {color: '#1A1A1A', width: 1}}, hoverlabel: PLOTLY_HOVER_CONFIG},
    {type: 'bar', name: 'Monthly', x: LANGUAGE_DATA.filter(d => d.language !== 'Others').map(d => d.monthly), y: languages, orientation: 'h', marker: {color: CHART_COLORS.accent, line: {color: '#1A1A1A', width: 1}}, hoverlabel: PLOTLY_HOVER_CONFIG}
  ];
  const layout = {
    ...PLOTLY_LAYOUT_DEFAULTS,
    title: {text: 'Publication Frequency by Language', font: {size: 22, family: 'Playfair Display, Georgia, serif', weight: 700}},
    barmode: 'stack',
    xaxis: {title: 'Number of Periodicals'},
    yaxis: {autorange: 'reversed'},
    margin: {l: 100, r: 40, t: 80, b: 60},
    height: 600,
    showlegend: true,
    legend: {orientation: 'h', x: 0.5, xanchor: 'center', y: -0.15}
  };
  return {data, layout};
}

function buildFrequencyStateData() {
  const sortedStates = [...PERIODICITY_BY_STATE].sort((a, b) => b.daily - a.daily);
  const data = [
    {type: 'bar', name: 'Daily', y: sortedStates.map(d => d.state), x: sortedStates.map(d => d.daily), orientation: 'h', marker: {color: '#1FB8CD', line: {color: '#1A1A1A', width: 1}}},
    {type: 'bar', name: 'Weekly', y: sortedStates.map(d => d.state), x: sortedStates.map(d => d.weekly), orientation: 'h', marker: {color: '#FFC185', line: {color: '#1A1A1A', width: 1}}},
    {type: 'bar', name: 'Monthly', y: sortedStates.map(d => d.state), x: sortedStates.map(d => d.monthly), orientation: 'h', marker: {color: '#D4AF37', line: {color: '#1A1A1A', width: 1}}}
  ];
  const layout = {
    title: {text: 'State-wise Publication Frequency Breakdown', font: {size: 20, family: 'Playfair Display, Georgia, serif', weight: 700}},
    barmode: 'stack', xaxis: {title: 'Number of Periodicals'}, yaxis: {autorange: 'reversed'},
    paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: '#FEFEFE', font: {family: 'Merriweather, Georgia, serif'},
    margin: {l: 140, r: 40, t: 60, b: 60}, showlegend: true, legend: {orientation: 'h', x: 0.5, xanchor: 'center', y: -0.15}
  };
  return {data, layout};
}

function buildFrequencyTimelineData() {
  const data = [
    {type: 'scatter', mode: 'lines+markers', name: 'Daily %', x: CENSORSHIP_CORRELATION_DATA.map(d => d.period.split(':')[0]), y: CENSORSHIP_CORRELATION_DATA.map(d => d.daily), line: {color: CHART_COLORS.primary, width: 3}, marker: {size: 10, color: CHART_COLORS.primary}, hovertemplate: '<b>%{x}</b><br>Daily: <b>%{y}%</b><br>%{customdata}<extra></extra>', customdata: CENSORSHIP_CORRELATION_DATA.map(d => d.context), hoverlabel: PLOTLY_HOVER_CONFIG},
    {type: 'scatter', mode: 'lines+markers', name: 'Weekly %', x: CENSORSHIP_CORRELATION_DATA.map(d => d.period.split(':')[0]), y: CENSORSHIP_CORRELATION_DATA.map(d => d.weekly), line: {color: CHART_COLORS.secondary, width: 3}, marker: {size: 10, color: CHART_COLORS.secondary}, hovertemplate: '<b>%{x}</b><br>Weekly: <b>%{y}%</b><br>%{customdata}<extra></extra>', customdata: CENSORSHIP_CORRELATION_DATA.map(d => d.context), hoverlabel: PLOTLY_HOVER_CONFIG},
    {type: 'scatter', mode: 'lines+markers', name: 'Monthly %', x: CENSORSHIP_CORRELATION_DATA.map(d => d.period.split(':')[0]), y: CENSORSHIP_CORRELATION_DATA.map(d => d.monthly), line: {color: CHART_COLORS.accent, width: 3}, marker: {size: 10, color: CHART_COLORS.accent}, hovertemplate: '<b>%{x}</b><br>Monthly: <b>%{y}%</b><br>%{customdata}<extra></extra>', customdata: CENSORSHIP_CORRELATION_DATA.map(d => d.context), hoverlabel: PLOTLY_HOVER_CONFIG}
  ];
  const layout = {
    ...PLOTLY_LAYOUT_DEFAULTS,
    title: {text: 'How Censorship Laws Shaped Publication Frequency', font: {size: 20, family: 'Playfair Display, Georgia, serif', weight: 700}, y: 0.95, x: 0.5, xanchor: 'center', yanchor: 'top'},
    xaxis: {tickangle: -45, tickfont: {size: 10}},
    yaxis: {title: 'Share of Publications (%)', range: [0, 70]},
    margin: {l: 60, r: 40, t: 80, b: 100},
    height: 500,
    showlegend: true,
    legend: {orientation: 'h', x: 0.5, xanchor: 'center', y: -0.15},
    annotations: [
      {x: '1975-1977', y: 42, text: 'Emergency: Weekly safer', showarrow: true, arrowhead: 2, ax: -30, ay: -40, font: {size: 10}},
      {x: '1857-1910', y: 35, text: 'Press Act deposits', showarrow: true, arrowhead: 2, ax: 30, ay: 40, font: {size: 10}}
    ]
  };
  return {data, layout};
}

// OLD FREQUENCY CHART FUNCTIONS REMOVED - Using instant render

function openModal5() {
  openModalByNumber(5);
}

function closeModal5() {
  closeAllModals();
}



// ===== CARD 6: FOREIGN LANGUAGES =====

const FOREIGN_LANGUAGE_TIMELINE = {
  'Nepali': [20, 40, 80, 85, 140, 190, 206],
  'Arabic': [5, 8, 12, 14, 20, 28, 33],
  'Tibetan': [0, 0, 2, 3, 5, 6, 7],
  'French': [5, 5, 5, 5, 6, 7, 8]
};

const TIMELINE_PERIODS = ['1947-1951', '1951-1960', '1960-1975', '1975-1977', '1977-1991', '1991-2011', '2011+'];

const FOREIGN_LANGUAGE_DATA = [
  { language: 'Nepali', periodicals: 206, share: 72.53, locations: 'Darjeeling, Sikkim, Hill regions', context: 'Border communities, post-independence linguistic federalism' },
  { language: 'Arabic', periodicals: 33, share: 11.61, locations: 'Kerala, Tamil Nadu, Coastal', context: 'Historical Islamic trade routes, minority communities' },
  { language: 'French', periodicals: 8, share: 2.81, locations: 'Pondicherry, Urban centers', context: 'French Union territory legacy' },
  { language: 'Tibetan', periodicals: 7, share: 2.46, locations: 'Delhi NCR, Himachal Pradesh', context: 'Refugee communities post-1959, political asylum' },
  { language: 'Others', periodicals: 30, share: 10.56, locations: 'Various', context: 'Other foreign language communities' }
];

function renderForeignLanguageChartsInstant() {
  try {
    if (!CHART_CACHE.foreignLanguage) {
      CHART_CACHE.foreignLanguage = buildForeignLanguagePieData();
      CHART_CACHE.foreignTimeline = buildForeignLanguageTimelineData();
    }
    
    const pieElement = document.getElementById('foreignLanguageChart');
    const timelineElement = document.getElementById('foreignLanguageTimelineChart');
    
    if (pieElement) Plotly.newPlot('foreignLanguageChart', CHART_CACHE.foreignLanguage.data, CHART_CACHE.foreignLanguage.layout, {responsive: true, displayModeBar: false});
    if (timelineElement) Plotly.newPlot('foreignLanguageTimelineChart', CHART_CACHE.foreignTimeline.data, CHART_CACHE.foreignTimeline.layout, {responsive: true, displayModeBar: false});
  } catch (error) {
    console.error('Error rendering foreign language charts:', error);
  }
}

function buildForeignLanguagePieData() {
  const data = [{
    type: 'pie',
    labels: FOREIGN_LANGUAGE_DATA.map(d => d.language),
    values: FOREIGN_LANGUAGE_DATA.map(d => d.periodicals),
    marker: {
      colors: [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary, CHART_COLORS.accent]
    },
    hovertemplate: '<b>%{label}</b><br>Periodicals: <b>%{value}</b><br>Share: <b>%{customdata.share}%</b><br>Locations: <b>%{customdata.locations}</b><br><extra></extra>',
    customdata: FOREIGN_LANGUAGE_DATA.map(d => ({share: d.share.toFixed(2), locations: d.locations})),
    textinfo: 'label+percent',
    textposition: 'auto',
    pull: [0.1, 0, 0, 0, 0],
    hoverlabel: PLOTLY_HOVER_CONFIG
  }];
  const layout = {
    ...PLOTLY_LAYOUT_DEFAULTS,
    title: {text: 'Foreign Language Publications (Total: 284)', font: {size: 22, family: 'Playfair Display, Georgia, serif', weight: 700}},
    showlegend: true,
    legend: {orientation: 'v', x: 1.05, y: 0.5},
    height: 500
  };
  return {data, layout};
}

function buildForeignLanguageTimelineData() {
  const data = [
    {type: 'scatter', mode: 'lines+markers', name: 'Nepali', x: TIMELINE_PERIODS, y: FOREIGN_LANGUAGE_TIMELINE['Nepali'], line: {color: CHART_COLORS.primary, width: 3}, marker: {size: 8, color: CHART_COLORS.primary}, hovertemplate: '<b>%{x}</b><br>Nepali: <b>%{y}</b> publications<extra></extra>', hoverlabel: PLOTLY_HOVER_CONFIG},
    {type: 'scatter', mode: 'lines+markers', name: 'Arabic', x: TIMELINE_PERIODS, y: FOREIGN_LANGUAGE_TIMELINE['Arabic'], line: {color: CHART_COLORS.secondary, width: 3}, marker: {size: 8, color: CHART_COLORS.secondary}, hovertemplate: '<b>%{x}</b><br>Arabic: <b>%{y}</b> publications<extra></extra>', hoverlabel: PLOTLY_HOVER_CONFIG},
    {type: 'scatter', mode: 'lines+markers', name: 'Tibetan', x: TIMELINE_PERIODS, y: FOREIGN_LANGUAGE_TIMELINE['Tibetan'], line: {color: CHART_COLORS.tertiary, width: 3}, marker: {size: 8, color: CHART_COLORS.tertiary}, hovertemplate: '<b>%{x}</b><br>Tibetan: <b>%{y}</b> publications<extra></extra>', hoverlabel: PLOTLY_HOVER_CONFIG},
    {type: 'scatter', mode: 'lines+markers', name: 'French', x: TIMELINE_PERIODS, y: FOREIGN_LANGUAGE_TIMELINE['French'], line: {color: CHART_COLORS.quaternary, width: 3}, marker: {size: 8, color: CHART_COLORS.quaternary}, hovertemplate: '<b>%{x}</b><br>French: <b>%{y}</b> publications<extra></extra>', hoverlabel: PLOTLY_HOVER_CONFIG}
  ];
  const layout = {
    ...PLOTLY_LAYOUT_DEFAULTS,
    title: {text: 'Post-Independence Foreign Language Press Growth', font: {size: 20, family: 'Playfair Display, Georgia, serif', weight: 700}, y: 0.95, x: 0.5, xanchor: 'center', yanchor: 'top'},
    xaxis: {tickangle: -45, tickfont: {size: 10}},
    yaxis: {title: 'Number of Publications', range: [0, 220]},
    margin: {l: 60, r: 40, t: 80, b: 100},
    height: 500,
    showlegend: true,
    legend: {orientation: 'h', x: 0.5, xanchor: 'center', y: -0.15},
    annotations: [
      {x: '1951-1960', y: 40, text: 'Linguistic federalism', showarrow: true, arrowhead: 2, ax: 0, ay: -40, font: {size: 10}},
      {x: '1960-1975', y: 80, text: 'State reorganization', showarrow: true, arrowhead: 2, ax: 30, ay: 40, font: {size: 10}},
      {x: '1975-1977', y: 85, text: 'Emergency: Foreign press protected', showarrow: true, arrowhead: 2, ax: -40, ay: -30, font: {size: 10}}
    ]
  };
  return {data, layout};
}

// OLD FOREIGN LANGUAGE FUNCTIONS REMOVED - Using instant render

function createGeographicClusteringVizOLD() {
  const geoData = FOREIGN_LANGUAGE_DATA.filter(d => d.language !== 'Others');
  
  const barData = [{
    type: 'bar',
    y: geoData.map(d => d.language),
    x: geoData.map(d => d.periodicals),
    orientation: 'h',
    marker: {
      color: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F'],
      line: { color: '#1A1A1A', width: 1 }
    },
    text: geoData.map(d => d.periodicals),
    textposition: 'outside',
    hovertemplate: '<b>%{y}</b><br>' +
                   'Periodicals: <b>%{x}</b><br>' +
                   'Locations: <b>%{customdata.locations}</b><br>' +
                   'Context: <b>%{customdata.context}</b><br>' +
                   '<extra></extra>',
    customdata: geoData.map(d => ({ locations: d.locations, context: d.context })),
    hoverlabel: {
      bgcolor: '#F5E6D3',
      bordercolor: '#1A1A1A',
      font: { size: 13, family: 'Merriweather, Georgia, serif', color: '#2C1810' }
    }
  }];
  
  const geoLayout = {
    title: {
      text: 'Geographic Clustering of Foreign Language Press',
      font: { size: 20, family: 'Playfair Display, Georgia, serif', weight: 700 }
    },
    xaxis: { title: 'Number of Periodicals' },
    yaxis: { autorange: 'reversed' },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: '#FEFEFE',
    font: { family: 'Merriweather, Georgia, serif' },
    margin: { l: 100, r: 60, t: 60, b: 60 }
  };
  
  Plotly.newPlot('foreignLanguageGeoChart', geoData, geoLayout, { responsive: true, displayModeBar: false });
}

function openModal6() {
  openModalByNumber(6);
}

function closeModal6() {
  closeAllModals();
}



// ===== CARD 8: DISCOURSE ANALYSIS - BAG OF WORDS =====
function openModal8() {
  openModalByNumber(8);
}

function closeModal8() {
  closeAllModals();
}
// ===== CARD 7 (NOW CARD 3): REGISTRATION STATUS =====

const REGISTRATION_DATA = [
  { category: 'Old Registration', count: 65572, percentage: 56.27 },
  { category: 'New Registration', count: 50954, percentage: 43.72 },
  { category: 'Unregistered', count: 5, percentage: 0.004 }
];

const REGISTRATION_TIMELINE = [
  { era: 'Colonial (pre-1947)', old_reg: 5000, new_reg: 0, survival: 10, context: 'Security deposits block most publishers' },
  { era: 'Independence (1947-1951)', old_reg: 10000, new_reg: 2000, survival: 15, context: 'Transition period, uncertainty' },
  { era: 'POMA Era (1951-1960)', old_reg: 15000, new_reg: 8000, survival: 25, context: 'Pre-censorship ban enables growth' },
  { era: 'Growth (1960-1975)', old_reg: 25000, new_reg: 18000, survival: 35, context: 'Constitutional framework solidifies' },
  { era: 'Emergency (1975-1977)', old_reg: 28000, new_reg: 19000, survival: 20, context: 'Registration frozen, suppression' },
  { era: 'Recovery (1977-1991)', old_reg: 38000, new_reg: 28000, survival: 22, context: 'Slow recovery, constraints' },
  { era: 'Liberalization (1991-2011)', old_reg: 55000, new_reg: 42000, survival: 26, context: 'Market explosion, capital inflow' },
  { era: 'Digital Age (2011+)', old_reg: 65572, new_reg: 50954, survival: 21.53, context: 'Print consolidation, digital shift' }
];

let selectedRegistrationEra = null;

function renderRegistrationChartsInstant() {
  try {
    if (!CHART_CACHE.registration) {
      CHART_CACHE.registration = buildRegistrationBarData();
      CHART_CACHE.registrationTimeline = buildRegistrationTimelineData();
    }
    
    const barElement = document.getElementById('registrationChart');
    const timelineElement = document.getElementById('registrationTimelineChart');
    
    if (barElement) Plotly.newPlot('registrationChart', CHART_CACHE.registration.data, CHART_CACHE.registration.layout, {responsive: true, displayModeBar: false});
    if (timelineElement) Plotly.newPlot('registrationTimelineChart', CHART_CACHE.registrationTimeline.data, CHART_CACHE.registrationTimeline.layout, {responsive: true, displayModeBar: false});
  } catch (error) {
    console.error('Error rendering registration charts:', error);
  }
}

function buildRegistrationBarData() {
  const total = REGISTRATION_DATA.reduce((sum, d) => sum + d.count, 0);
  
  const barData = [{
    type: 'bar',
    y: ['Registration Status'],
    x: [REGISTRATION_DATA[0].count],
    name: 'Old Registration',
    orientation: 'h',
    marker: { color: '#7A6430', line: { color: '#1A1A1A', width: 1 } },
    text: REGISTRATION_DATA[0].percentage.toFixed(2) + '%',
    textposition: 'inside',
    textfont: { color: '#F5E6D3', size: 16, weight: 700 },
    hovertemplate: '<b>Old Registration</b><br>Count: <b>%{x:,}</b><br>Percentage: <b>' + REGISTRATION_DATA[0].percentage.toFixed(2) + '%</b><extra></extra>'
  }, {
    type: 'bar',
    y: ['Registration Status'],
    x: [REGISTRATION_DATA[1].count],
    name: 'New Registration',
    orientation: 'h',
    marker: { color: '#1FB8CD', line: { color: '#1A1A1A', width: 1 } },
    text: REGISTRATION_DATA[1].percentage.toFixed(2) + '%',
    textposition: 'inside',
    textfont: { color: '#1A1A1A', size: 16, weight: 700 },
    hovertemplate: '<b>New Registration</b><br>Count: <b>%{x:,}</b><br>Percentage: <b>' + REGISTRATION_DATA[1].percentage.toFixed(2) + '%</b><extra></extra>'
  }, {
    type: 'bar',
    y: ['Registration Status'],
    x: [REGISTRATION_DATA[2].count],
    name: 'Unregistered',
    orientation: 'h',
    marker: { color: '#DB4545', line: { color: '#1A1A1A', width: 1 } },
    text: REGISTRATION_DATA[2].percentage.toFixed(3) + '%',
    textposition: 'inside',
    textfont: { color: '#F5E6D3', size: 12 },
    hovertemplate: '<b>Unregistered</b><br>Count: <b>%{x}</b><br>Percentage: <b>' + REGISTRATION_DATA[2].percentage.toFixed(3) + '%</b><extra></extra>'
  }];
  
  const barLayout = {
    title: {
      text: 'Registration Status Distribution (Total: 116,531)',
      font: { size: 22, family: 'Playfair Display, Georgia, serif', weight: 700 }
    },
    barmode: 'stack',
    xaxis: {
      title: 'Number of Publications',
      tickformat: ','
    },
    yaxis: {
      showticklabels: false
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: '#FEFEFE',
    font: { family: 'Merriweather, Georgia, serif' },
    margin: { l: 40, r: 40, t: 80, b: 60 },
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: -0.15
    },
    height: 250
  };
  
  return {data: barData, layout: barLayout};
}

function buildRegistrationTimelineData() {
  const totalTrace = {
    type: 'bar',
    name: 'Total Registrations',
    x: REGISTRATION_TIMELINE.map(d => d.era.split('(')[0].trim()),
    y: REGISTRATION_TIMELINE.map(d => d.old_reg + d.new_reg),
    marker: {
      color: REGISTRATION_TIMELINE.map(d => d.old_reg + d.new_reg),
      colorscale: [[0, '#F5E6D3'], [0.5, '#D4AF37'], [1.0, '#1FB8CD']],
      line: { color: '#1A1A1A', width: 1 }
    },
    hovertemplate: '<b>%{x}</b><br>' +
                   'Total: <b>%{y:,}</b><br>' +
                   'Old: <b>%{customdata.old:,}</b><br>' +
                   'New: <b>%{customdata.new:,}</b><br>' +
                   'Survival: <b>%{customdata.survival}%</b><br>' +
                   '%{customdata.context}<extra></extra>',
    customdata: REGISTRATION_TIMELINE.map(d => ({
      old: d.old_reg,
      new: d.new_reg,
      survival: d.survival,
      context: d.context
    })),
    hoverlabel: {
      bgcolor: '#F5E6D3',
      bordercolor: '#1A1A1A',
      font: { size: 13, family: 'Merriweather, Georgia, serif', color: '#2C1810' }
    }
  };
  
  const timelineLayout = {
    title: {
      text: 'Registration Surges During Different Eras',
      font: { size: 20, family: 'Playfair Display, Georgia, serif', weight: 700 }
    },
    xaxis: {
      tickangle: -45,
      tickfont: { size: 10 }
    },
    yaxis: {
      title: 'Total Registrations',
      tickformat: ','
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: '#FEFEFE',
    font: { family: 'Merriweather, Georgia, serif' },
    margin: { l: 80, r: 40, t: 60, b: 120 },
    showlegend: false,
    annotations: [
      {
        x: 'POMA Era',
        y: 23000,
        text: '1951: Explosion',
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -40,
        font: { size: 10, color: '#2C1810' }
      },
      {
        x: 'Emergency',
        y: 47000,
        text: 'Freeze',
        showarrow: true,
        arrowhead: 2,
        ax: 20,
        ay: -30,
        font: { size: 10, color: '#2C1810' }
      },
      {
        x: 'Liberalization',
        y: 97000,
        text: 'Market explosion',
        showarrow: true,
        arrowhead: 2,
        ax: 0,
        ay: -40,
        font: { size: 10, color: '#2C1810' }
      }
    ]
  };
  
  return {data: [totalTrace], layout: timelineLayout};
}

// OLD REGISTRATION FUNCTIONS REMOVED - Using instant render

function openModal7() {
  openModalByNumber(7);
}

function closeModal7() {
  closeAllModals();
}



// Update keyboard support for all modals
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeAllModals();
  }
});
