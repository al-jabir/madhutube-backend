/**
 * Formats duration in seconds to a human-readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration (e.g., "4:20", "45 sec", "1:20:34")
 */
export const formatDuration = (seconds) => {
    // Validate input
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
        return '0 sec';
    }

    // Round to nearest integer
    const totalSeconds = Math.round(seconds);

    // Handle special case for less than 1 minute
    if (totalSeconds < 60) {
        return `${totalSeconds} sec`;
    }

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    // Format based on duration
    if (hours > 0) {
        // Format as HH:MM:SS
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        // Format as MM:SS
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
};

/**
 * Converts formatted duration back to seconds
 * @param {string} formattedDuration - Formatted duration string
 * @returns {number} - Duration in seconds
 */
export const parseDuration = (formattedDuration) => {
    if (!formattedDuration) return 0;

    // If it's already in seconds format
    if (formattedDuration.endsWith('sec')) {
        return parseInt(formattedDuration) || 0;
    }

    // Split by colons
    const parts = formattedDuration.split(':');

    if (parts.length === 2) {
        // MM:SS format
        const minutes = parseInt(parts[0]) || 0;
        const seconds = parseInt(parts[1]) || 0;
        return minutes * 60 + seconds;
    } else if (parts.length === 3) {
        // HH:MM:SS format
        const hours = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;
        const seconds = parseInt(parts[2]) || 0;
        return hours * 3600 + minutes * 60 + seconds;
    }

    return 0;
};