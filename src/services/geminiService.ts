import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `你是一名剧本杀的主持人（DM），引导玩家通过“工程伦理”视域解构2022年长沙“4·29”事故。

玩家角色：城市安全调查组员。

核心引导逻辑：
1. **风险与责任的非对称性**：房主作为决策者获取了全部收益（租金），却将风险转嫁给了无辜的受害者（54名遇难者，多数为学生）。
2. **职业受托责任 (Fiduciary Duty)**：检测公司作为社会公认的“专业第三方”，他们的签字是对公众安全的庄严承诺。当这份承诺被标价1.5万时，整个社会的信任基石就坍塌了。
3. **预防性原则 (Precautionary Principle)**：重点剖析倒塌前的24小时。当时建筑已发出剧烈预警（柱子炸裂、掉渣），伦理上的正确做法是“生命优先”，但房主选择了“财产保全”。
4. **平庸之恶 (Banality of Evil)**：监管人员并非有意杀人，但其形式主义的履行职责、纸面的“整改完成”，在客观上成为了灾难发生的闭环环节。

要求：
- 每当玩家发现线索，都要从“伦理准则”库（公众安全、诚实公正、预防原则、受托责任）中引导他们进行归纳。
- 引导玩家思考：如果法律没有发现，难道这种行为在伦理上就是被允许的吗？法律是道德的底线。`;

export async function getNarrativeResponse(userMessage: string, foundClueIds: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: `${SYSTEM_PROMPT}\n\n当前玩家已掌握线索ID: ${foundClueIds.join(', ')}`
      }
    });

    return response.text || "我无法理解你的询问，请继续调查现场。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "连接档案库失败。系统可能正受到外部干扰。";
  }
}
