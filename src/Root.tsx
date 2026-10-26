import React from "react";
import {Composition, Still} from "remotion";
import {HowRagWorks, TOTAL} from "./HowRagWorks";
import {RagStory, STORY_TOTAL} from "./RagStory";
import {MidnightDeploy, MD_TOTAL} from "./MidnightDeploy";
import {LastBlade, LB_TOTAL} from "./LastBlade";
import {PixelScriptPromo, PROMO_TOTAL} from "./Promo";
import {withWatermark} from "./Watermark";
import {Screenplay} from "./screenplay/Screenplay";
import {totalFrames, type ScreenplayProps} from "./screenplay/types";
import {DEMO_SCREENPLAY} from "./screenplay/demo";
import {DESIGNS, Terminal, TERM_THEMES} from "./designs/DebugDiaries";
import {Neon, ACCENTS} from "./designs/NeonTerminal";
import {DebugDiariesEntry, DD_TOTAL, ENTRY_001, ENTRY_002} from "./debugdiaries/Entry";
import {AVATARS} from "./debugdiaries/Avatar";
import {DebugDiaries002, E2_TOTAL} from "./debugdiaries/Entry002";
import {DebugDiaries003, E3_TOTAL} from "./debugdiaries/Entry003";
import {DebugDiaries004, E4_TOTAL} from "./debugdiaries/Entry004";
import {DebugDiaries005, E5_TOTAL} from "./debugdiaries/Entry005";
import {DebugDiaries006, E6_TOTAL} from "./debugdiaries/Entry006";
import {DebugDiaries007, E7_TOTAL} from "./debugdiaries/Entry007";
import {DebugDiaries008, E8_TOTAL} from "./debugdiaries/Entry008";
import {Origins01, O1_TOTAL} from "./debugdiaries/Origins01";
import {Origins02, O2_TOTAL} from "./debugdiaries/Origins02";
import {Origins03, O3_TOTAL} from "./debugdiaries/Origins03";
import {Inside01, I1_TOTAL} from "./debugdiaries/Inside01";
import {DebugDiaries009, E9_TOTAL} from "./debugdiaries/Entry009";
import {DebugDiaries010, E10_TOTAL} from "./debugdiaries/Entry010";
import {DebugDiaries011, E11_TOTAL} from "./debugdiaries/Entry011";
import {DebugDiaries012, E12_TOTAL} from "./debugdiaries/Entry012";
import {DebugDiaries013, E13_TOTAL} from "./debugdiaries/Entry013";
import {DebugDiaries014, E14_TOTAL} from "./debugdiaries/Entry014";
import {Banner, Highlight, HIGHLIGHTS} from "./debugdiaries/Brand";

// Episode styles get the Free-plan watermark when rendered with {"watermark": true}.
const HowRagWorksW = withWatermark(HowRagWorks);
const RagStoryW = withWatermark(RagStory);
const MidnightDeployW = withWatermark(MidnightDeploy);
const LastBladeW = withWatermark(LastBlade);
const ScreenplayW = withWatermark(Screenplay);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Screenplay"
      component={ScreenplayW}
      durationInFrames={totalFrames(DEMO_SCREENPLAY)}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{screenplay: DEMO_SCREENPLAY, channelName: "PixelScript", handle: "@pixelscript", episodeNumber: 1, music: 0, watermark: false} as ScreenplayProps}
      calculateMetadata={({props}) => ({durationInFrames: totalFrames((props as ScreenplayProps).screenplay)})}
    />
    <Composition id="HowRagWorks" component={HowRagWorksW} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="RagStory" component={RagStoryW} durationInFrames={STORY_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="MidnightDeploy" component={MidnightDeployW} durationInFrames={MD_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="LastBlade" component={LastBladeW} durationInFrames={LB_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="PixelScriptPromo" component={PixelScriptPromo} durationInFrames={PROMO_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="DebugDiaries" component={DebugDiariesEntry} durationInFrames={DD_TOTAL} fps={30} width={1080} height={1920} defaultProps={ENTRY_001} />
    <Composition id="DebugDiaries002" component={DebugDiaries002} durationInFrames={E2_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries003" component={DebugDiaries003} durationInFrames={E3_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries004" component={DebugDiaries004} durationInFrames={E4_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries005" component={DebugDiaries005} durationInFrames={E5_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries006" component={DebugDiaries006} durationInFrames={E6_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries007" component={DebugDiaries007} durationInFrames={E7_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries008" component={DebugDiaries008} durationInFrames={E8_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="Origins01" component={Origins01} durationInFrames={O1_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="Origins02" component={Origins02} durationInFrames={O2_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="Origins03" component={Origins03} durationInFrames={O3_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="Inside01" component={Inside01} durationInFrames={I1_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries009" component={DebugDiaries009} durationInFrames={E9_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries010" component={DebugDiaries010} durationInFrames={E10_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries011" component={DebugDiaries011} durationInFrames={E11_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries012" component={DebugDiaries012} durationInFrames={E12_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries013" component={DebugDiaries013} durationInFrames={E13_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="DebugDiaries014" component={DebugDiaries014} durationInFrames={E14_TOTAL} fps={30} width={1080} height={1920} />
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
