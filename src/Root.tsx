import React from "react";
import {Composition, Still} from "remotion";
import {HowRagWorks, TOTAL} from "./HowRagWorks";
import {RagStory, STORY_TOTAL} from "./RagStory";
import {MidnightDeploy, MD_TOTAL} from "./MidnightDeploy";
import {LastBlade, LB_TOTAL} from "./LastBlade";
import {PixelScriptPromo, PROMO_TOTAL} from "./Promo";
import {withWatermark} from "./Watermark";
import {DESIGNS, Terminal, TERM_THEMES} from "./designs/DebugDiaries";
import {Neon, ACCENTS} from "./designs/NeonTerminal";
import {DebugDiariesEntry, DD_TOTAL, ENTRY_001, ENTRY_002} from "./debugdiaries/Entry";
import {AVATARS} from "./debugdiaries/Avatar";
import {DebugDiaries002, E2_TOTAL} from "./debugdiaries/Entry002";
import {DebugDiaries003, E3_TOTAL} from "./debugdiaries/Entry003";
import {Banner, Highlight, HIGHLIGHTS} from "./debugdiaries/Brand";

// Episode styles get the Free-plan watermark when rendered with {"watermark": true}.
const HowRagWorksW = withWatermark(HowRagWorks);
const RagStoryW = withWatermark(RagStory);
const MidnightDeployW = withWatermark(MidnightDeploy);
const LastBladeW = withWatermark(LastBlade);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HowRagWorks" component={HowRagWorksW} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="RagStory" component={RagStoryW} durationInFrames={STORY_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="MidnightDeploy" component={MidnightDeployW} durationInFrames={MD_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="LastBlade" component={LastBladeW} durationInFrames={LB_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="PixelScriptPromo" component={PixelScriptPromo} durationInFrames={PROMO_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="DebugDiaries" component={DebugDiariesEntry} durationInFrames={DD_TOTAL} fps={30} width={1080} height={1920} defaultProps={ENTRY_001} />
    <Composition id="DebugDiaries002" component={DebugDiaries002} durationInFrames={E2_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries003" component={DebugDiaries003} durationInFrames={E3_TOTAL} fps={30} width={1080} height={1920} />
    <Still id="DD-Banner" component={Banner} width={2560} height={1440} />
    {HIGHLIGHTS.map((k) => <Still key={k} id={`DD-Highlight-${k}`} component={() => <Highlight kind={k} />} width={1080} height={1920} />)}
    {Object.entries(AVATARS).map(([name, A]) => <Still key={name} id={`DD-Avatar-${name}`} component={A} width={1080} height={1080} />)}
    {/* Debug Diaries channel design options (stills) */}
    {Object.entries(DESIGNS).flatMap(([name, C]) =>
      (["hook", "explain", "end"] as const).map((beat) => <Still key={`${name}-${beat}`} id={`DD-${name}-${beat}`} component={() => <C beat={beat} />} width={1080} height={1920} />),
    )}
    {Object.keys(TERM_THEMES).flatMap((theme) =>
      (["hook", "explain", "end"] as const).map((beat) => <Still key={`T-${theme}-${beat}`} id={`DD-Term-${theme}-${beat}`} component={() => <Terminal beat={beat} theme={theme} />} width={1080} height={1920} />),
    )}
    {Object.keys(ACCENTS).flatMap((accent) =>
      (["hook", "explain", "end"] as const).map((beat) => <Still key={`N-${accent}-${beat}`} id={`DD-Neon-${accent}-${beat}`} component={() => <Neon beat={beat} accent={accent} />} width={1080} height={1920} />),
    )}
  </>
);
