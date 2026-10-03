import { NODE_R } from './sceneLayout.js';

/**
 * Dibuja una escena ya posicionada (ver sceneLayout.js). Cada elemento tiene `key` estable y
 * su posición va en `style.transform`, así que entre pasos los elementos VIAJAN (transición CSS)
 * en lugar de reaparecer. Los elementos nuevos entran con `scene-pop`.
 */
const LANE_COLORS = ['var(--primary)', 'var(--color-remote)', 'var(--color-local)', 'var(--color-staging)'];
const ZONE_COLORS = { working: 'working', staging: 'staging', repo: 'local' };
const LINE_STYLE = {
  normal: { fill: 'transparent', text: 'var(--text-primary)' },
  ours: { fill: 'var(--color-working-bg)', text: 'var(--color-working)' },
  theirs: { fill: 'var(--color-remote-bg)', text: 'var(--color-remote)' },
  marker: { fill: 'var(--color-staging-bg)', text: 'var(--color-staging)' },
  added: { fill: 'var(--color-local-bg)', text: 'var(--color-local)' },
};

const move = (x, y) => ({ transform: `translate(${x}px, ${y}px)` });
const tagWidth = (text) => text.length * 7.4 + 16;
const headText = (head) => (head.attachedTo ? 'HEAD' : 'HEAD (detached)');

function Tag({ text, color, filled, dashed }) {
  const w = tagWidth(text);
  return (
    <g className="scene-pop">
      <rect x={-w / 2} y={-11} width={w} height={22} rx={6}
        fill={filled ? color : 'var(--bg-primary)'} stroke={color} strokeWidth={1.5} strokeDasharray={dashed ? '4 3' : undefined} />
      <text y={4} textAnchor="middle" className="scene-tag-text" fill={filled ? '#fff' : color}>{text}</text>
    </g>
  );
}

export default function SceneView({ layout, focus = [] }) {
  const isFocused = (id) => focus.includes(id);
  const { width, height } = layout;

  return (
    <svg className="scene-svg" viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-hidden="true">
      {layout.zones && (
        <g>
          {layout.zones.boxes.map(b => (
            <g key={`zone:${b.name}`} className={`scene-zone ${isFocused(`zone:${b.name}`) ? 'is-focused' : ''}`} style={move(b.x, b.y)}>
              <rect width={b.w} height={b.h} rx={12} fill={`var(--color-${ZONE_COLORS[b.name]}-bg)`} stroke={`var(--color-${ZONE_COLORS[b.name]})`} strokeWidth={isFocused(`zone:${b.name}`) ? 3 : 1.5} />
              <text x={14} y={27} className="scene-zone-title" fill={`var(--color-${ZONE_COLORS[b.name]})`}>{b.label}</text>
            </g>
          ))}
          {layout.zones.files.map(f => (
            <g key={`file:${f.key}`} className="scene-item" style={move(f.x, f.y)}>
              <g className="scene-pop">
                {isFocused(`file:${f.key}`) && <rect className="scene-halo" x={-4} y={-4} width={f.w + 8} height={38} rx={10} />}
                <rect width={f.w} height={30} rx={8} fill="var(--bg-primary)" stroke={`var(--color-${ZONE_COLORS[f.zone]})`} strokeWidth={1.5} />
                <text x={12} y={20} className="scene-file-name">{f.name}</text>
                <text x={f.w - 10} y={20} textAnchor="end" className="scene-file-status" fill={`var(--color-${ZONE_COLORS[f.zone]})`}>{f.status}</text>
              </g>
            </g>
          ))}
          {layout.zones.repoCommits.map(c => (
            <g key={`repo:${c.key}`} className="scene-item" style={move(c.x, c.y)}>
              <g className="scene-pop">
                {isFocused(`commit:${c.id}`) && <circle className="scene-halo" r={NODE_R + 6} />}
                <circle r={NODE_R - 2} fill="var(--color-local)" />
                <text x={NODE_R + 10} y={4} className="scene-commit-id">{c.id}</text>
              </g>
            </g>
          ))}
        </g>
      )}

      {layout.graphs.map(g => (
        <g key={`panel:${g.title}`}>
          <g className="scene-item" style={move(g.x, g.y)}>
            <rect width={g.w} height={g.h} rx={12} fill="var(--bg-secondary)" stroke={g.remote ? 'var(--color-remote)' : 'var(--border-color)'} strokeWidth={1.5} strokeDasharray={g.remote ? '6 4' : undefined} />
            <text x={14} y={26} className="scene-panel-title">{g.title}</text>
          </g>
          {g.edges.map(e => (
            <path key={e.key} className={`scene-edge scene-fade ${e.ghost ? 'is-ghost' : ''}`} style={{ d: `path("${e.d}")` }} d={e.d} />
          ))}
          {g.nodes.map(n => (
            <g key={n.key} className="scene-item" style={move(n.cx, n.cy)}>
              <g className={`scene-pop ${n.ghost ? 'is-ghost' : ''}`}>
                {isFocused(`commit:${n.id}`) && <circle className="scene-halo" r={NODE_R + 7} />}
                <circle r={NODE_R} fill={n.ghost ? 'var(--bg-secondary)' : LANE_COLORS[n.lane % LANE_COLORS.length]}
                  stroke={n.ghost ? 'var(--text-tertiary)' : 'var(--bg-primary)'} strokeWidth={2} strokeDasharray={n.ghost ? '4 3' : undefined} />
                <text y={NODE_R + 16} textAnchor="middle" className="scene-commit-id">{n.id}</text>
              </g>
            </g>
          ))}
          {g.labels.map(lb => (
            <g key={lb.key} className="scene-item" style={move(lb.cx, lb.cy)}>
              {isFocused(`branch:${lb.branch}`) && <rect className="scene-halo" x={-tagWidth(lb.branch) / 2 - 4} y={-15} width={tagWidth(lb.branch) + 8} height={30} rx={9} />}
              <Tag text={lb.branch} color={lb.remoteTracking ? 'var(--color-remote)' : 'var(--primary-text)'} filled={!lb.remoteTracking} dashed={lb.remoteTracking} />
            </g>
          ))}
          <g key={g.head.key} className="scene-item" style={move(g.head.cx, g.head.cy)}>
            {isFocused('head') && <rect className="scene-halo" x={-tagWidth(headText(g.head)) / 2 - 4} y={-15} width={tagWidth(headText(g.head)) + 8} height={30} rx={9} />}
            <Tag text={headText(g.head)} color="var(--text-primary)" />
          </g>
        </g>
      ))}

      {layout.code && (
        <g>
          <g className="scene-item" style={move(layout.code.x, layout.code.y)}>
            <rect width={layout.code.w} height={layout.code.h} rx={12} fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth={1.5} />
            <text x={14} y={26} className="scene-panel-title">{layout.code.file}</text>
          </g>
          {layout.code.lines.map(ln => (
            <g key={ln.key} className="scene-item" style={move(ln.x, ln.y)}>
              <g className="scene-pop">
                {isFocused(`line:${ln.id}`) && <rect className="scene-halo" x={-4} y={-3} width={ln.w + 8} height={28} rx={6} />}
                <rect width={ln.w} height={22} rx={4} fill={LINE_STYLE[ln.kind].fill} />
                <text x={10} y={16} className="scene-code-line" fill={LINE_STYLE[ln.kind].text}>{ln.text}</text>
              </g>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
