import { useState } from "react";
import {
  MessageSquare,
  Bookmark,
  Heart,
  Share2,
  Sparkles,
  ArrowUp,
  Search,
  CheckCircle,
  PlusCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { StartupIdea, ValidationReport } from "../types";

interface SharedPost {
  id: string;
  name: string;
  industry: string;
  idea: string;
  region: string;
  creator: string;
  votes: number;
  commentsCount: number;
  voted?: boolean;
  bookmarked?: boolean;
}

interface CommunityForumProps {
  currentReport?: ValidationReport | null;
  currentIdea?: StartupIdea | null;
}

export default function CommunityForum({ currentReport, currentIdea }: CommunityForumProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<SharedPost[]>([
    {
      id: "p1",
      name: "SolAgri Drone Matrix",
      industry: "AgriTech",
      idea: "Deploying automated crop soil-moisture measuring drone hives in hyper-arid farming belts.",
      region: "United States (Sub-Sahara Regional)",
      creator: "Steve W. • Co-founder",
      votes: 42,
      commentsCount: 9,
      voted: false,
      bookmarked: true
    },
    {
      id: "p2",
      name: "BlockChain Ledger Escrow",
      industry: "FinTech",
      idea: "An automated real-estate contract escrow manager settling transactions with verified bank ledgers.",
      region: "Estonia (Global Client Base)",
      creator: "Vitalik D. • Architect",
      votes: 29,
      commentsCount: 3,
      voted: true,
      bookmarked: false
    },
    {
      id: "p3",
      name: "MedScribe AI",
      industry: "HealthTech",
      idea: "Real-time voice-to-structured HIPAA records transcriber specialized for high-turnover emergency rooms.",
      region: "Canada / LatAm East",
      creator: "Nadia T. • Chief Surgeon",
      votes: 81,
      commentsCount: 14,
      voted: false,
      bookmarked: false
    }
  ]);

  const [comments, setComments] = useState<Record<string, Array<{ author: string; text: string; date: string }>>>({
    p1: [
      { author: "Sarah Connor (Automaton)", text: "This is a beautiful model! Are the Soil sensors calibrated for high dry thermal shifts?", date: "2 hours ago" },
      { author: "Elon M. (VC Partners)", text: "Scale strategy seems bulletproof. I would highly advise starting in US Mid-west regions before African rollout.", date: "4 hours ago" }
    ]
  });

  const [activePostForComments, setActivePostForComments] = useState<string | null>("p1");
  const [newCommentText, setNewCommentText] = useState("");

  const handleVote = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            votes: p.voted ? p.votes - 1 : p.votes + 1,
            voted: !p.voted
          };
        }
        return p;
      })
    );
  };

  const handleBookmark = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return { ...p, bookmarked: !p.bookmarked };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;

    const newComment = {
      author: "You (Innovator Member)",
      text: newCommentText,
      date: "Just now"
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, commentsCount: p.commentsCount + 1 };
        }
        return p;
      })
    );

    setNewCommentText("");
  };

  const handleShareCurrentIdeaObj = () => {
    if (!currentIdea) return;
    const newPost: SharedPost = {
      id: `p_user_${Date.now()}`,
      name: currentIdea.name,
      industry: currentIdea.industry,
      idea: currentIdea.idea,
      region: currentIdea.region || "Global",
      creator: "You (Platform Innovator)",
      votes: 1,
      commentsCount: 0
    };
    setPosts(prev => [newPost, ...prev]);
    setActivePostForComments(newPost.id);
  };

  const filteredPosts = posts.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.idea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-12 gap-8 font-sans">
      {/* Posts list panel */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Startup Community Forum</h2>
            <p className="text-xs text-slate-500 mt-1">
              Collaborate, share validation templates, and collect feedback from fellow platform members.
            </p>
          </div>

          {currentIdea && (
            <button
              onClick={handleShareCurrentIdeaObj}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 rounded-xl text-xs font-semibold text-white shadow shadow-blue-500/10 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Share Present Concept</span>
            </button>
          )}
        </div>

        {/* Search tool */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 outline-none shadow-sm placeholder:text-slate-400 font-normal text-slate-700"
            placeholder="Search communities by industries, key features, or titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* List of discussions */}
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const isCommentsOpen = activePostForComments === post.id;
            return (
              <div
                key={post.id}
                className={`p-6 bg-white border rounded-2xl transition-all shadow-sm ${
                  isCommentsOpen ? "border-blue-500 shadow-blue-100/50" : "border-slate-250/70 hover:border-slate-305"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 tracking-wider bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
                      {post.industry}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2.5 hover:text-blue-600 cursor-pointer">
                      {post.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1.5">
                      "{post.idea}"
                    </p>
                    <div className="flex items-center space-x-4 text-[10px] mt-4 font-semibold text-slate-400 font-mono text-[11px]">
                      <span>By: {post.creator}</span>
                      <span>Target: {post.region}</span>
                    </div>
                  </div>

                  {/* Upvote button */}
                  <button
                    onClick={() => handleVote(post.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                      post.voted
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/15"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-xs font-black mt-1 leading-none">{post.votes}</span>
                  </button>
                </div>

                {/* Engagement panel */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs font-bold text-slate-500">
                  <button
                    onClick={() => setActivePostForComments(isCommentsOpen ? null : post.id)}
                    className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount} Feedback Advisory Notes</span>
                  </button>

                  <div className="flex items-center space-x-3.5">
                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`hover:text-amber-500 transition-colors ${
                        post.bookmarked ? "text-amber-500" : "text-slate-400"
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                    <button className="hover:text-rose-500 text-slate-400 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-frame comments view */}
      <div className="lg:col-span-4 self-start">
        {activePostForComments ? (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-lg p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-xs font-black text-slate-800 tracking-wider">
                ADVISORY NOTES PANEL
              </span>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded font-bold">
                PRO ACTIVE
              </span>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {(comments[activePostForComments] || []).map((comm, cIdx) => (
                <div key={cIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
                    <span className="text-blue-600">{comm.author}</span>
                    <span>{comm.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {comm.text}
                  </p>
                </div>
              ))}
              {(!comments[activePostForComments] || comments[activePostForComments].length === 0) && (
                <div className="text-center py-6 text-slate-400 text-xs leading-relaxed font-normal font-mono">
                  No advisory comments listed of yet. Be the first to advise!
                </div>
              )}
            </div>

            {/* Post comment form */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <textarea
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-blue-500 resize-none placeholder:text-slate-400 font-normal"
                placeholder="Compose a constructive advisory note..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              />
              <button
                onClick={() => handleAddComment(activePostForComments)}
                className="w-full py-2 bg-slate-900 border border-transparent text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-all"
              >
                Dispatch Advisory Note
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-8 text-center text-slate-400 text-xs font-normal">
            Select "Feedback Advisory Notes" on any conceptual card to inspect or contribute advice.
          </div>
        )}
      </div>
    </div>
  );
}
