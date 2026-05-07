import { Clue, Party, EthicalPrinciple } from './types';

export const ETHICAL_PRINCIPLES: EthicalPrinciple[] = [
  {
    id: 'p1',
    title: '公众安全与福利 (Public Safety)',
    description: '这是工程伦理的第一法则。工程师在履行职业职责时，必须将公众的安全、健康和福利置于首位。在本案中，这一平衡被极度的贪婪所打破。'
  },
  {
    id: 'p2',
    title: '预防性伦理 (Precautionary Principle)',
    description: '如果一项行动存在造成重大或不可逆损害的风险，即使在缺乏充分科学证据的情况下，也应采取预防措施。房主在发现裂缝后仍不撤离，是对该原则的彻底背叛。'
  },
  {
    id: 'p3',
    title: '诚实与公正 (Integrity & Truthfulness)',
    description: '工程师的职业公信力建立在数据的真实性之上。虚假报告不仅是弄虚作假，更是摧毁了社会对专业技术人员的“受托责任”信任。'
  },
  {
    id: 'p4',
    title: '工程作为社会实验 (Engineering as Social Experiment)',
    description: '工程项目本质上是在社会环境中进行的实验。在未经充分论证的情况下非法加盖，相当于让住户在不知情的情况下参与了一场致命的概率实验。'
  }
];

export const CLUES: Clue[] = [
  {
    id: 'c1',
    title: '加盖部分的“致命杠杆”',
    description: '这种行为在工程伦理中被称为“无视安全边界的权力膨胀”。',
    category: 'PHYSICAL',
    found: false,
    content: '该建筑原设计6层，房主在未经过任何结构演算的情况下非法加盖至8层。新加的2层多为沉重的砖混结构。',
    ethicsViolation: '这体现了典型的“非理性风险乐观主义”。房主将扩建收益归于自己，却将坍塌风险完全强加给了租客和公众。'
  },
  {
    id: 'c2',
    title: '一张价值1.5万元的“通行证”',
    description: '职业道德的商品化，是工程行业最危险的腐蚀剂。',
    category: 'DOCUMENT',
    found: false,
    content: '检测机构人员（湘大检测）在未到现场、未看图纸的情况下，根据房主发来的照片，在办公室凭空捏造了一份“B级安全报告”。',
    ethicsViolation: '这是“技术欺诈”。工程师将专业判断权变现为私人利益，直接导致了监管链条的断裂。'
  },
  {
    id: 'c3',
    title: '消失的预警信号',
    description: '在灾难发生前，有无数次机会可以通过“预防性撤离”减少损失。',
    category: 'WITNESS',
    found: false,
    content: '事故前一晚，一楼商铺租户反馈天花板掉渣、承重柱开裂。房主吴某带人简单“修补”后坚称安全，禁止疏散。',
    ethicsViolation: '完全剥夺了受害者的“知情同意权”。在工程安全面临明确威胁时，房主因担心租金损失而故意隐瞒风险。'
  },
  {
    id: 'c4',
    title: '“形式主义”的闭环',
    description: '监管缺失在伦理上具有“负面共犯”的性质。',
    category: 'DOCUMENT',
    found: false,
    content: '当地“自建房整治”专项行动中，多个部门对该违建视而不见。执法人员在收到举报后，仅凭一张虚假报告就完成了“销号”。',
    ethicsViolation: '行政人员的职业懈怠导致了“制度性平庸之恶”。当监管变为纸面作业，公权力便失去了保护公众的伦理合法性。'
  }
];

export const PARTIES: Party[] = [
  {
    id: 'owner',
    name: '房主吴某',
    role: '利益最大化者',
    description: '非法扩建、无视预警、自私自利。',
    faultLevel: 3,
    ethicsAnalysis: '他代表了“贪婪驱动的决策者”。他通过信息不对称（隐瞒建筑裂缝）剥削租户的生命安全，完全漠视了作为“准建设方”应承担的社会契约责任。'
  },
  {
    id: 'tester',
    name: '湘大检测公司',
    role: '背道而驰的把关人',
    description: '出卖诚信、知假造假、危害深远。',
    faultLevel: 3,
    ethicsAnalysis: '作为本案中最令人发指的专业失范方，他们违背了“称职服务”和“诚实准则”。他们用虚假的专业背书，为原本已在崩溃边缘的建筑披上了“安全”的伪装。'
  },
  {
    id: 'supervisor',
    name: '职能部门',
    role: '失职的守望者',
    description: '监管缺失、行政懈怠、流于形式。',
    faultLevel: 2,
    ethicsAnalysis: '他们在伦理上犯了“集体职责缺失”。当监管者为了流程合规（准时销号）而放弃对实质正义（真实安全）的追求时，悲剧的发生便具有了必然性。'
  }
];
