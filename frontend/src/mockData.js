// src/mockData.js
// EXACT mock entries for Indore CCTV testing users

const generateSpecificScans = () => {
  let scans = [];
  const baseDate = new Date();

  // Helper to create the object
  const createScan = (userId, type, location, timestamps, offsetDays, exactDateStr) => {
    return timestamps.map((ts, i) => ({
      id: `SCAN-${userId.split('@')[0].toUpperCase()}-${i + 1}`,
      userId: userId,
      date: exactDateStr ? exactDateStr : new Date(baseDate.getTime() - offsetDays * 24 * 60 * 60 * 1000).toISOString(),
      location: location,
      type: type,
      duration: 900, // 15 mins
      incidents: [
        {
          timestamp: ts,
          description: `${type} activity detected with high confidence at ${location}.`,
          severity: type === 'FIRE' || type === 'ACCIDENT' ? 'CRITICAL' : 'HIGH'
        }
      ],
      status: 'COMPLETED',
      threatScore: 80 + Math.floor(Math.random() * 15), // 80-95
      photoUrl: `https://picsum.photos/seed/${userId}${i}/800/450` // Mock case photo
    }));
  };

  // 1: test1 (3 FIRE VijayNagar)
  scans.push(...createScan('test1@indore.com', 'FIRE', 'Vijay Nagar', ['00:45', '01:23', '02:15'], 1, '15 Mar 2026 14:32'));
  
  // 2: test2 (4 THEFT Sarafa)
  scans.push(...createScan('test2@indore.com', 'THEFT', 'Sarafa', ['05:45', '07:12', '09:33', '11:02'], 2, '14 Mar 2026 23:15'));
  
  // 3: test3 (2 BREAKIN Palasia)
  scans.push(...createScan('test3@indore.com', 'BREAKIN', 'Palasia', ['03:27', '04:51'], 3));
  
  // 4: test4 (5 FIGHT SuperCorridor)
  scans.push(...createScan('test4@indore.com', 'FIGHT', 'Super Corridor', ['01:08', '02:44', '04:19', '06:02', '08:17'], 4));
  
  // 5: test5 (3 ACCIDENT AB Road)
  scans.push(...createScan('test5@indore.com', 'ACCIDENT', 'AB Road', ['10:15', '12:47', '14:22'], 5));

  // Initialize from LocalStorage or use the base data
  const storedScans = localStorage.getItem('ai_indore_scans');
  if (storedScans) {
      try {
          const parsed = JSON.parse(storedScans);
          return parsed.length > 0 ? parsed : scans;
      } catch (e) {
          return scans;
      }
  }
  return scans;
};

export const mockScans = generateSpecificScans();

export const saveMockScans = (scansArray) => {
    localStorage.setItem('ai_indore_scans', JSON.stringify(scansArray));
};

export const mockStats = {
  totalScans: 1250,
  activeThreats: 14,
  resolvedIncidents: 1120,
  systemHealth: 99.8
};
