import React from 'react';
import { Event, RSVP, Match } from '../types';

interface BracketProps {
    event: Event;
    rsvps: RSVP[];
    isFestero: boolean;
    onWinnerSelect: (matchId: string, winnerRsvpId: string) => void;
}

const Bracket: React.FC<BracketProps> = ({ event, rsvps, isFestero, onWinnerSelect }) => {
    if (!event.bracket || event.bracket.length === 0) {
        return <p className="text-gray-400">El bracket se generará cuando haya al menos 2 equipos apuntados.</p>;
    }

    const getTeamName = (rsvpId: string | null) => {
        if (!rsvpId) return <span className="text-gray-500">Por determinar</span>;
        const rsvp = rsvps.find(r => r.id === rsvpId);
        if (!rsvp) return <span className="text-gray-500">Equipo no encontrado</span>;
        return rsvp.participants[0]?.name || 'Equipo sin nombre';
    };

    const maxRound = Math.max(...event.bracket.map(m => m.round));
    const rounds: Match[][] = [];
    for (let i = 1; i <= maxRound; i++) {
        rounds.push(event.bracket.filter(m => m.round === i).sort((a,b) => a.matchInRound - b.matchInRound));
    }

    return (
        <div className="flex space-x-4 md:space-x-8 overflow-x-auto pb-4">
            {rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="flex flex-col space-y-4 md:space-y-8 flex-shrink-0">
                    <h4 className="text-xl font-bold text-center text-cyan-300">Ronda {roundIndex + 1}</h4>
                    {round.map(match => (
                        <div key={match.id} className="bg-gray-700 p-3 rounded-lg w-48 md:w-56">
                            <ul className="space-y-2">
                                {match.participants.map((rsvpId, participantIndex) => {
                                    const teamName = getTeamName(rsvpId);
                                    const isWinner = match.winner === rsvpId;
                                    const canSelectWinner = isFestero && match.participants[0] && match.participants[1] && !match.winner;

                                    return (
                                        <li 
                                            key={participantIndex} 
                                            className={`
                                                flex justify-between items-center text-sm p-2 rounded 
                                                ${isWinner ? 'bg-green-600 font-bold' : 'bg-gray-800'}
                                                ${canSelectWinner && rsvpId ? 'cursor-pointer hover:bg-cyan-700' : ''}
                                            `}
                                            onClick={() => canSelectWinner && rsvpId && onWinnerSelect(match.id, rsvpId)}
                                        >
                                            <span className="truncate">{teamName}</span>
                                            {isWinner && <span className="text-xs ml-2">🏆</span>}
                                        </li>
                                    );
                                })}
                                 {!match.participants[1] && match.participants[0] && (
                                    <li className="bg-gray-800 text-sm p-2 rounded text-gray-500 italic">BYE</li>
                                 )}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Bracket;
