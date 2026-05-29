'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Shield, AlertTriangle, CheckCircle, Info, Copy, Search, Play, RefreshCw } from 'lucide-react';

// ==========================================
// 1. TIMELINE AREA CHART (Bezier curves, smooth gradients)
// ==========================================

interface TimelineData {
    label: string;
    [key: string]: number | string;
}

interface TimelineAreaChartProps {
    data: TimelineData[];
    series: { key: string; color: string; label: string }[];
    height?: number;
}

export function TimelineAreaChart({ data, series, height = 300 }: TimelineAreaChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [activeSeries, setActiveSeries] = useState<string[]>(series.map(s => s.key));
    const containerRef = useRef<HTMLDivElement>(null);

    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center" style={{ height, color: 'var(--text-muted)' }}>No hay datos suficientes</div>;
    }

    const padding = { top: 30, right: 30, bottom: 40, left: 65 };
    const chartHeight = height - padding.top - padding.bottom;
    const chartWidth = 500; // Simulated viewBox width for scaling

    // Find min/max values
    let maxVal = 100;
    data.forEach(d => {
        series.forEach(s => {
            if (activeSeries.includes(s.key)) {
                const val = Number(d[s.key]) || 0;
                if (val > maxVal) maxVal = val;
            }
        });
    });
    // Round max value to nice number
    maxVal = Math.ceil(maxVal * 1.1 / 10) * 10 || 100;

    const getX = (index: number) => {
        if (data.length <= 1) return padding.left;
        return padding.left + (index / (data.length - 1)) * (chartWidth - padding.left - padding.right);
    };

    const getY = (value: number) => {
        return padding.top + chartHeight - (value / maxVal) * chartHeight;
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Map mouseX to the closest index
        const svgWidth = rect.width;
        const scaleX = chartWidth / svgWidth;
        const chartMouseX = mouseX * scaleX;

        // Find closest point
        let closestIdx = 0;
        let minDiff = Infinity;
        for (let i = 0; i < data.length; i++) {
            const ptX = getX(i);
            const diff = Math.abs(chartMouseX - ptX);
            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = i;
            }
        }

        setHoveredIdx(closestIdx);
        setTooltipPos({ x: mouseX, y: mouseY - 15 });
    };

    const toggleSeries = (key: string) => {
        if (activeSeries.includes(key)) {
            if (activeSeries.length > 1) {
                setActiveSeries(activeSeries.filter(k => k !== key));
            }
        } else {
            setActiveSeries([...activeSeries, key]);
        }
    };

    // Y Axis Gridlines (4 levels)
    const yGridLevels = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
            {/* Interactive Legend */}
            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {series.map(s => {
                    const isActive = activeSeries.includes(s.key);
                    return (
                        <div
                            key={s.key}
                            onClick={() => toggleSeries(s.key)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                opacity: isActive ? 1 : 0.4,
                                background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '10px',
                                border: `1px solid ${isActive ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: s.color }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{s.label}</span>
                        </div>
                    );
                })}
            </div>

            <svg
                viewBox={`0 0 ${chartWidth} ${height}`}
                width="100%"
                height={height}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ overflow: 'visible', userSelect: 'none' }}
            >
                <defs>
                    {series.map(s => (
                        <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={s.color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={s.color} stopOpacity="0.0" />
                        </linearGradient>
                    ))}
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
                    </filter>
                </defs>

                {/* Y-Axis Gridlines */}
                {yGridLevels.map((lvl, idx) => {
                    const val = lvl * maxVal;
                    const y = getY(val);
                    return (
                        <g key={idx} opacity="0.85">
                            <line
                                x1={padding.left}
                                y1={y}
                                x2={chartWidth - padding.right}
                                y2={y}
                                stroke="rgba(255, 255, 255, 0.05)"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                            />
                            <text
                                x={padding.left - 10}
                                y={y + 4}
                                fill="var(--text-muted)"
                                fontSize="10"
                                fontWeight="600"
                                textAnchor="end"
                            >
                                {val >= 1000 ? `$${(val/1000).toFixed(1)}k` : `$${val.toLocaleString()}`}
                            </text>
                        </g>
                    );
                })}

                {/* X-Axis labels (Show up to 6 labels for clutter prevention) */}
                {data.map((d, idx) => {
                    const moduloVal = Math.ceil(data.length / 6);
                    if (idx % moduloVal !== 0 && idx !== data.length - 1) return null;
                    const x = getX(idx);
                    return (
                        <text
                            key={idx}
                            x={x}
                            y={height - padding.bottom + 20}
                            fill="var(--text-muted)"
                            fontSize="9.5"
                            fontWeight="600"
                            textAnchor="middle"
                        >
                            {d.label}
                        </text>
                    );
                })}

                {/* Draw Area & Lines */}
                {series.map(s => {
                    if (!activeSeries.includes(s.key)) return null;

                    // Build line coordinates
                    const points = data.map((d, idx) => ({
                        x: getX(idx),
                        y: getY(Number(d[s.key]) || 0)
                    }));

                    if (points.length === 0) return null;

                    // Build bezier curve path description
                    let dPath = `M ${points[0].x} ${points[0].y}`;
                    for (let i = 0; i < points.length - 1; i++) {
                        const p0 = points[i];
                        const p1 = points[i + 1];
                        const cpX1 = p0.x + (p1.x - p0.x) / 3;
                        const cpY1 = p0.y;
                        const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
                        const cpY2 = p1.y;
                        dPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
                    }

                    // Build area path description
                    const dArea = `${dPath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

                    return (
                        <g key={s.key}>
                            {/* Area Gradient */}
                            <path d={dArea} fill={`url(#grad-${s.key})`} />

                            {/* Solid Path Line */}
                            <path
                                d={dPath}
                                fill="none"
                                stroke={s.color}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                filter="url(#shadow)"
                            />

                            {/* Circle Markers */}
                            {points.map((pt, idx) => {
                                const isHovered = hoveredIdx === idx;
                                return (
                                    <circle
                                        key={idx}
                                        cx={pt.x}
                                        cy={pt.y}
                                        r={isHovered ? 5.5 : 2.5}
                                        fill="var(--bg-main)"
                                        stroke={s.color}
                                        strokeWidth={isHovered ? 3.5 : 1.5}
                                        style={{ transition: 'all 0.15s ease' }}
                                    />
                                );
                            })}
                        </g>
                    );
                })}

                {/* Vertical Cursor on Hover */}
                {hoveredIdx !== null && (
                    <line
                        x1={getX(hoveredIdx)}
                        y1={padding.top}
                        x2={getX(hoveredIdx)}
                        y2={height - padding.bottom}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                    />
                )}
            </svg>

            {/* Hover Tooltip Popup */}
            {hoveredIdx !== null && (
                <div
                    className="glass-panel"
                    style={{
                        position: 'absolute',
                        top: tooltipPos.y,
                        left: Math.min(tooltipPos.x + 15, (containerRef.current?.getBoundingClientRect().width || 400) - 170),
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-glass)',
                        background: 'rgba(5, 7, 10, 0.9)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                        zIndex: 100,
                        pointerEvents: 'none',
                        textAlign: 'left',
                        minWidth: '150px'
                    }}
                >
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white', marginBottom: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.2rem' }}>
                        {data[hoveredIdx].label}
                    </div>
                    {series.map(s => {
                        if (!activeSeries.includes(s.key)) return null;
                        const val = data[hoveredIdx][s.key];
                        return (
                            <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', margin: '0.2rem 0' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color }} />
                                    {s.label}
                                </span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>
                                    {typeof val === 'number' ? (val > 999 ? '$' + val.toLocaleString() : val) : val}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ==========================================
// 2. COMPARATIVE BAR CHART (Double side-by-side)
// ==========================================

interface BarData {
    category: string;
    current: number;
    previous: number;
}

interface ComparativeBarChartProps {
    data: BarData[];
    currentLabel: string;
    previousLabel: string;
    currentColor?: string;
    previousColor?: string;
    height?: number;
}

export function ComparativeBarChart({
    data,
    currentLabel,
    previousLabel,
    currentColor = '#10b981',
    previousColor = 'rgba(255, 255, 255, 0.15)',
    height = 280
}: ComparativeBarChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<{ idx: number; type: 'current' | 'previous' } | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center" style={{ height, color: 'var(--text-muted)' }}>No hay datos suficientes</div>;
    }

    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartHeight = height - padding.top - padding.bottom;
    const viewWidth = 500;

    let maxVal = 100;
    data.forEach(d => {
        if (d.current > maxVal) maxVal = d.current;
        if (d.previous > maxVal) maxVal = d.previous;
    });
    maxVal = Math.ceil(maxVal * 1.1 / 10) * 10;

    const groupWidth = (viewWidth - padding.left - padding.right) / data.length;
    const barWidth = Math.max(groupWidth * 0.35, 6);

    const getY = (val: number) => {
        return padding.top + chartHeight - (val / maxVal) * chartHeight;
    };

    const handleMouseMove = (e: React.MouseEvent, idx: number, type: 'current' | 'previous') => {
        const rect = e.currentTarget.getBoundingClientRect();
        const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
        if (parentRect) {
            setTooltipPos({
                x: rect.left - parentRect.left + rect.width / 2,
                y: rect.top - parentRect.top - 10
            });
        }
        setHoveredIdx({ idx, type });
    };

    const gridLines = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div style={{ width: '100%', position: 'relative' }}>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', justifyContent: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: currentColor }} />
                    <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>{currentLabel}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: previousColor }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{previousLabel}</span>
                </div>
            </div>

            <svg viewBox={`0 0 ${viewWidth} ${height}`} width="100%" height={height} style={{ overflow: 'visible', userSelect: 'none' }}>
                {/* Horizontal Grid */}
                {gridLines.map((lvl, i) => {
                    const val = lvl * maxVal;
                    const y = getY(val);
                    return (
                        <g key={i}>
                            <line
                                x1={padding.left}
                                y1={y}
                                x2={viewWidth - padding.right}
                                y2={y}
                                stroke="rgba(255,255,255,0.04)"
                                strokeWidth="1"
                            />
                            <text
                                x={padding.left - 10}
                                y={y + 3}
                                textAnchor="end"
                                fill="var(--text-muted)"
                                fontSize="9"
                                fontWeight="700"
                            >
                                {val >= 1000 ? `$${(val/1000).toFixed(0)}k` : `$${val}`}
                            </text>
                        </g>
                    );
                })}

                {/* Bars */}
                {data.map((d, idx) => {
                    const groupX = padding.left + idx * groupWidth;
                    const centerX = groupX + groupWidth / 2;

                    // Bar Coordinates
                    const curX = centerX - barWidth - 2;
                    const prevX = centerX + 2;

                    const curY = getY(d.current);
                    const prevY = getY(d.previous);

                    const curH = Math.max(chartHeight - (curY - padding.top), 2);
                    const prevH = Math.max(chartHeight - (prevY - padding.top), 2);

                    const isCurHovered = hoveredIdx?.idx === idx && hoveredIdx.type === 'current';
                    const isPrevHovered = hoveredIdx?.idx === idx && hoveredIdx.type === 'previous';

                    return (
                        <g key={idx}>
                            {/* Previous Period Bar */}
                            <rect
                                x={prevX}
                                y={prevY}
                                width={barWidth}
                                height={prevH}
                                fill={previousColor}
                                rx="3"
                                opacity={isPrevHovered ? 1 : 0.8}
                                style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                                onMouseMove={(e) => handleMouseMove(e, idx, 'previous')}
                                onMouseLeave={() => setHoveredIdx(null)}
                            />

                            {/* Current Period Bar */}
                            <rect
                                x={curX}
                                y={curY}
                                width={barWidth}
                                height={curH}
                                fill={currentColor}
                                rx="3"
                                style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                                opacity={isCurHovered ? 1 : 0.95}
                                filter={isCurHovered ? 'drop-shadow(0px 0px 8px rgba(16,185,129,0.4))' : ''}
                                onMouseMove={(e) => handleMouseMove(e, idx, 'current')}
                                onMouseLeave={() => setHoveredIdx(null)}
                            />

                            {/* Category X labels */}
                            <text
                                x={centerX}
                                y={height - padding.bottom + 20}
                                fill="var(--text-muted)"
                                fontSize="9"
                                fontWeight="700"
                                textAnchor="middle"
                            >
                                {d.category.length > 10 ? d.category.substring(0, 8) + '..' : d.category}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Float Tooltip */}
            {hoveredIdx !== null && (
                <div
                    className="glass-panel"
                    style={{
                        position: 'absolute',
                        left: `${tooltipPos.x}px`,
                        top: `${tooltipPos.y - 45}px`,
                        transform: 'translateX(-50%)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-glass)',
                        background: 'rgba(5, 7, 10, 0.95)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                        zIndex: 99
                    }}
                >
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.1rem' }}>{data[hoveredIdx.idx].category}</div>
                    <div>
                        {hoveredIdx.type === 'current' ? (
                            <span style={{ color: currentColor }}>
                                {currentLabel}: <strong>${data[hoveredIdx.idx].current.toLocaleString()}</strong>
                            </span>
                        ) : (
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                                {previousLabel}: <strong>${data[hoveredIdx.idx].previous.toLocaleString()}</strong>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ==========================================
// 3. PREMIUM DONUT CHART (Interactive slices)
// ==========================================

interface PieSlice {
    name: string;
    value: number;
    fill: string;
}

interface PremiumDonutChartProps {
    data: PieSlice[];
    title?: string;
    centerLabel?: string;
}

export function PremiumDonutChart({ data, title, centerLabel = "Ingresos" }: PremiumDonutChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px', color: 'var(--text-muted)' }}>
                No hay datos suficientes
            </div>
        );
    }

    const size = 200;
    const radius = 70;
    const strokeWidth = 22;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedPercentage = 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {title && <h4 style={{ marginBottom: '1.5rem', color: 'white', fontSize: '1rem', width: '100%', textAlign: 'left' }}>{title}</h4>}

            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                    {data.map((item, idx) => {
                        const pct = (item.value / total);
                        const dashArray = `${pct * circumference} ${circumference}`;
                        const dashOffset = -accumulatedPercentage * circumference;
                        accumulatedPercentage += pct;

                        const isHovered = hoveredIdx === idx;

                        return (
                            <circle
                                key={idx}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke={item.fill}
                                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="butt"
                                style={{
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    filter: isHovered ? `drop-shadow(0px 0px 8px ${item.fill})` : 'none'
                                }}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            />
                        );
                    })}
                </svg>

                {/* Central Labels */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {hoveredIdx !== null ? data[hoveredIdx].name : centerLabel}
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginTop: '0.2rem' }}>
                        {hoveredIdx !== null ? (
                            `$${data[hoveredIdx].value.toLocaleString()}`
                        ) : (
                            `$${total.toLocaleString()}`
                        )}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.7 }}>
                        {hoveredIdx !== null ? (
                            `${((data[hoveredIdx].value / total) * 100).toFixed(1)}%`
                        ) : (
                            '100%'
                        )}
                    </span>
                </div>
            </div>

            {/* List / Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.5rem', marginTop: '1.5rem' }}>
                {data.map((item, idx) => {
                    const isHovered = hoveredIdx === idx;
                    return (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.4rem 0.6rem',
                                borderRadius: '8px',
                                background: isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                                border: `1px solid ${isHovered ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.fill }} />
                                <span style={{ fontSize: '0.8rem', color: isHovered ? 'white' : 'var(--text-muted)', fontWeight: 600 }}>{item.name}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>
                                ${item.value.toLocaleString()}
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '0.5rem', opacity: 0.6 }}>
                                    {((item.value / total) * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ==========================================
// 4. INTERACTIVE HEAT MAP (Yucatan / Riviera Maya Coast)
// ==========================================

interface Hotspot {
    id: string;
    name: string;
    cx: number;
    cy: number;
    bookings: number;
    revenue: number;
    trend: 'up' | 'stable' | 'down';
}

interface InteractiveHeatMapProps {
    hotspots?: Hotspot[];
}

export function InteractiveHeatMap({ hotspots: propHotspots }: InteractiveHeatMapProps) {
    const [activeSpot, setActiveSpot] = useState<Hotspot | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Default coordinates and styling for Riviera Maya Coast
    const defaultHotspots: Hotspot[] = [
        { id: 'im', name: 'Isla Mujeres', cx: 240, cy: 30, bookings: 34, revenue: 119000, trend: 'up' },
        { id: 'cun', name: 'Cancún', cx: 220, cy: 55, bookings: 125, revenue: 375000, trend: 'up' },
        { id: 'pdc', name: 'Playa del Carmen', cx: 160, cy: 155, bookings: 88, revenue: 176000, trend: 'stable' },
        { id: 'coz', name: 'Cozumel', cx: 200, cy: 185, bookings: 42, revenue: 147000, trend: 'up' },
        { id: 'tul', name: 'Tulum', cx: 90, cy: 260, bookings: 67, revenue: 201000, trend: 'up' }
    ];

    const spots = propHotspots || defaultHotspots;

    const handleSpotHover = (e: React.MouseEvent, spot: Hotspot) => {
        setActiveSpot(spot);
    };

    return (
        <div ref={containerRef} style={{ width: '100%', position: 'relative', background: '#030508', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid var(--border-glass)', minHeight: '340px' }}>
            <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: 700 }}>Mapa de Calor Turístico</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Zonas calientes con mayor volumen de reservas en la Riviera Maya.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1.5rem', alignItems: 'center' }}>
                {/* SVG Coastline Map */}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <svg viewBox="0 0 300 300" width="100%" style={{ maxHeight: '280px', overflow: 'visible' }}>
                        {/* Styles for animation */}
                        <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes pulse-ring {
                                0% { r: 6px; opacity: 0.8; stroke-width: 1px; }
                                50% { r: 18px; opacity: 0.4; stroke-width: 1.5px; }
                                100% { r: 28px; opacity: 0; stroke-width: 0px; }
                            }
                            .pulse-circle {
                                animation: pulse-ring 2.5s infinite ease-out;
                                fill: none;
                            }
                            .pulse-circle-2 {
                                animation: pulse-ring 2.5s infinite ease-out;
                                animation-delay: 1.2s;
                                fill: none;
                            }
                        `}} />

                        {/* Peninsula Land Silhouette */}
                        <path
                            d="M 5,280 C 10,250 30,220 50,200 C 65,180 80,170 90,140 C 100,110 110,80 130,50 C 145,30 160,20 190,20 C 210,20 220,30 230,50 C 235,60 230,80 220,100 C 205,120 185,130 170,150 C 150,170 145,190 135,210 C 120,230 100,250 80,270 C 60,290 30,300 5,300 Z"
                            fill="#0d1117"
                            stroke="rgba(139, 92, 246, 0.15)"
                            strokeWidth="2"
                        />

                        {/* Cozumel Island */}
                        <path
                            d="M 200,165 C 205,160 215,165 218,175 C 220,185 210,195 205,192 C 198,188 195,175 200,165 Z"
                            fill="#0d1117"
                            stroke="rgba(139, 92, 246, 0.15)"
                            strokeWidth="1.5"
                        />

                        {/* Styled Glow Coastline Path */}
                        <path
                            d="M 50,200 C 65,180 80,170 90,140 C 100,110 110,80 130,50 C 145,30 160,20 190,20 C 210,20 220,30 230,50 C 235,60 230,80 220,100 C 205,120 185,130 170,150 C 150,170 145,190 135,210 C 120,230 100,250 80,270"
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            opacity="0.6"
                            filter="drop-shadow(0px 0px 4px #8b5cf6)"
                        />

                        {/* Interactive Hotspots */}
                        {spots.map((spot) => {
                            const isFocused = activeSpot?.id === spot.id;
                            // Larger radius for higher bookings
                            const scaleFactor = Math.min(Math.max(spot.bookings / 10, 4), 16);

                            return (
                                <g
                                    key={spot.id}
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => handleSpotHover(e, spot)}
                                    onMouseLeave={() => setActiveSpot(null)}
                                >
                                    {/* Pulsating Heat Rings */}
                                    <circle cx={spot.cx} cy={spot.cy} className="pulse-circle" stroke="#f43f5e" />
                                    <circle cx={spot.cx} cy={spot.cy} className="pulse-circle-2" stroke="#8b5cf6" />

                                    {/* Heat Glow Center */}
                                    <circle
                                        cx={spot.cx}
                                        cy={spot.cy}
                                        r={isFocused ? scaleFactor + 4 : scaleFactor}
                                        fill="rgba(244, 63, 94, 0.25)"
                                        stroke="#f43f5e"
                                        strokeWidth="1.5"
                                        style={{ transition: 'all 0.2s ease' }}
                                    />

                                    {/* Core Center dot */}
                                    <circle cx={spot.cx} cy={spot.cy} r="4" fill="white" />

                                    {/* Quick Label */}
                                    <text
                                        x={spot.cx}
                                        y={spot.cy - scaleFactor - 4}
                                        fill="white"
                                        fontSize="9"
                                        fontWeight="800"
                                        textAnchor="middle"
                                        style={{ pointerEvents: 'none', filter: 'drop-shadow(1px 1px 2px #000)' }}
                                    >
                                        {spot.name}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Hotspot details panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {activeSpot ? (
                        <div className="glass-card" style={{ padding: '1rem', border: '1px solid rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.04)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f43f5e' }} />
                                {activeSpot.name}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Reservas:</span>
                                    <strong style={{ color: 'white' }}>{activeSpot.bookings}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Ingresos:</span>
                                    <strong style={{ color: 'white' }}>${activeSpot.revenue.toLocaleString()}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Tendencia:</span>
                                    <strong style={{ color: activeSpot.trend === 'up' ? '#10b981' : '#f59e0b' }}>
                                        {activeSpot.trend === 'up' ? '📈 Alta' : '📊 Estable'}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: '1.2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
                            <Info size={20} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                Pasa el cursor sobre los círculos del mapa para explorar el desglose geográfico en tiempo real.
                            </p>
                        </div>
                    )}

                    {/* Ranking list (mini) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.2rem', marginBottom: '0.2rem' }}>Ranking de Zonas</span>
                        {spots.sort((a,b) => b.bookings - a.bookings).slice(0,3).map((spot, i) => (
                            <div key={spot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{i+1}. {spot.name}</span>
                                <span style={{ color: 'white', fontWeight: 700 }}>{spot.bookings} res.</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 5. SYSTEM LOG TERMINAL (Interactive logger)
// ==========================================

export interface SystemLog {
    id: string;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'SUCCESS' | 'ERROR';
    module: string;
    message: string;
}

interface SystemLogTerminalProps {
    logs: SystemLog[];
}

export function SystemLogTerminal({ logs: initialLogs }: SystemLogTerminalProps) {
    const [search, setSearch] = useState('');
    const [filterLevel, setFilterLevel] = useState<string>('ALL');
    const [isPlaying, setIsPlaying] = useState(true);
    const [terminalLogs, setTerminalLogs] = useState<SystemLog[]>(initialLogs);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    // Dynamic log generator to simulate "live system activities"
    useEffect(() => {
        setTerminalLogs(initialLogs);
    }, [initialLogs]);

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            const actions = [
                { lvl: 'SUCCESS', mod: 'AUTH', msg: 'Admin session verified correctly via secure cookies.' },
                { lvl: 'INFO', mod: 'DB', msg: 'Prisma pool connection health checked: 4 active connections.' },
                { lvl: 'INFO', mod: 'API', msg: 'GET /api/reservations - 200 OK - fetched in 32ms' },
                { lvl: 'SUCCESS', mod: 'PAY', msg: 'Stripe webhook payment_intent.succeeded validated.' },
                { lvl: 'WARN', mod: 'FLOTA', msg: 'Taxi plate VJP-5678 checked-in for preventative engine diagnostic.' },
                { lvl: 'INFO', mod: 'ADMIN', msg: 'Admin updated prices configurations: packages references cached.' }
            ];

            const item = actions[Math.floor(Math.random() * actions.length)];
            const newLog: SystemLog = {
                id: Math.random().toString(),
                timestamp: new Date().toLocaleTimeString(),
                level: item.lvl as 'INFO' | 'WARN' | 'SUCCESS',
                module: item.mod,
                message: item.msg
            };

            setTerminalLogs(prev => [...prev.slice(-49), newLog]); // Keep max 50 logs in view
        }, 6000);

        return () => clearInterval(interval);
    }, [isPlaying]);

    // Auto scroll to bottom
    useEffect(() => {
        if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [terminalLogs]);

    const filteredLogs = terminalLogs.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) || log.module.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
        return matchesSearch && matchesLevel;
    });

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'SUCCESS': return <CheckCircle size={12} color="#10b981" />;
            case 'WARN': return <AlertTriangle size={12} color="#f59e0b" />;
            case 'ERROR': return <AlertTriangle size={12} color="#ef4444" />;
            default: return <Info size={12} color="#3b82f6" />;
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'SUCCESS': return '#10b981';
            case 'WARN': return '#f59e0b';
            case 'ERROR': return '#ef4444';
            default: return '#3b82f6';
        }
    };

    const copyToClipboard = () => {
        const text = filteredLogs.map(l => `[${l.timestamp}] [${l.level}] [${l.module}] ${l.message}`).join('\n');
        navigator.clipboard.writeText(text);
        alert('Logs copiados al portapapeles');
    };

    return (
        <div style={{ background: '#020406', borderRadius: '1.25rem', border: '1px solid var(--border-glass)', padding: '1.5rem', width: '100%' }}>
            {/* Header Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Terminal size={18} color="var(--primary)" />
                    <span style={{ fontWeight: 800, color: 'white', fontSize: '1rem' }}>Consola del Sistema e Historial</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(139,92,246,0.2)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 700 }}>
                        {isPlaying ? '● VIVO' : 'PAUSADO'}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '8px',
                            color: 'white',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Play size={12} color={isPlaying ? '#ef4444' : '#10b981'} />
                        {isPlaying ? 'Pausar' : 'Reanudar'}
                    </button>
                    <button
                        onClick={copyToClipboard}
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '8px',
                            color: 'white',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Copy size={12} />
                        Copiar
                    </button>
                </div>
            </div>

            {/* Filter controls */}
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: '1 1 200px' }}>
                    <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Buscar en logs..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '8px',
                            padding: '0.4rem 1rem 0.4rem 2.2rem',
                            fontSize: '0.8rem',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Level Buttons */}
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {['ALL', 'INFO', 'SUCCESS', 'WARN'].map(lvl => (
                        <button
                            key={lvl}
                            onClick={() => setFilterLevel(lvl)}
                            style={{
                                background: filterLevel === lvl ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                border: filterLevel === lvl ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                                color: filterLevel === lvl ? 'white' : 'var(--text-muted)',
                                padding: '0.35rem 0.7rem',
                                fontSize: '0.75rem',
                                borderRadius: '6px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {lvl === 'ALL' ? 'Todos' : lvl}
                        </button>
                    ))}
                </div>
            </div>

            {/* Terminal Window */}
            <div style={{
                height: '240px',
                background: '#010203',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#abb2bf',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
            }}>
                {filteredLogs.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '4rem' }}>
                        No se encontraron registros de auditoría que coincidan.
                    </div>
                ) : (
                    filteredLogs.map(log => (
                        <div key={log.id} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', borderLeft: `2.5px solid ${getLevelColor(log.level)}`, paddingLeft: '0.5rem', lineHeight: '1.3' }}>
                            <span style={{ color: '#5c6370', flexShrink: 0 }}>[{log.timestamp}]</span>
                            <span style={{ color: getLevelColor(log.level), fontWeight: 800, fontSize: '0.7rem', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                {getLevelIcon(log.level)}
                                {log.level}
                            </span>
                            <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>[{log.module}]</span>
                            <span style={{ color: '#e06c75' }}>$</span>
                            <span style={{ color: 'white', textAlign: 'left', wordBreak: 'break-word' }}>{log.message}</span>
                        </div>
                    ))
                )}
                <div ref={terminalEndRef} />
            </div>
        </div>
    );
}
