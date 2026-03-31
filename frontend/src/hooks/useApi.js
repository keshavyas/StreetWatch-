import { useState } from 'react';
import { api } from '../utils/api';

export const useApi = () => {
    const [loading, setLoading] = useState(false);

    const getScans = async () => {
        setLoading(true);
        try {
            const data = await api.get('/scans/me');
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.error('Error fetching scans:', error);
            return [];
        }
    };

    const getScanById = async (scanId) => {
        setLoading(true);
        try {
            // Since we don't have a specific GET /api/scans/:id yet, 
            // we can filter the user's scans or add the endpoint if needed.
            // For now, let's fetch all and find.
            const scans = await api.get('/scans/me');
            setLoading(false);
            return scans.find(s => s._id === scanId);
        } catch (error) {
            setLoading(false);
            return null;
        }
    };

    const processVideoPayload = async (file) => {
        setLoading(true);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // Create a scan record in the database
            const data = await api.post('/scans', {
                incidents: [
                    { timestamp: '00:15-22s', description: 'Fire detected in quadrant 4', severity: 'HIGH', confidence: 94 },
                    { timestamp: '00:30-41s', description: 'Unauthorized entry attempt', severity: 'CRITICAL', confidence: 89 }
                ],
                location: 'Sector 7 - Indore Command',
                threatScore: 85,
                type: 'FIRE / THEFT',
            });
            
            setLoading(false);
            return data.scan;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const mockStats = {
        totalScans: 0,
        activeThreats: 0,
        systemHealth: 98
    };

    return { loading, getScans, getScanById, processVideoPayload, mockStats };
};
