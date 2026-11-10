// Mock Orbit AI response generator.
// In Phase B this gets replaced by a real call to /api/chat (Groq).
// The logic here mimics the action list from the spec:
//   mark_progress, update_item, set_deadline, add_item, add_folder,
//   rename_folder, delete_item, delete_folder, ask_clarification

import type { Item, Folder } from "@/lib/types";

export type ActionType =
  | "mark_progress"
  | "update_item"
  | "set_deadline"
  | "add_item"
  | "add_folder"
  | "rename_folder"
  | "delete_item"
  | "delete_folder"
  | "ask_clarification";

export type RiskLevel = "auto" | "ask_first";

export interface ChatAction {
  type: ActionType;
  risk: RiskLevel;
  // Target ids (always ids, never names — per spec)
  item_id?: string;
  folder_id?: string;
  // Action-specific payload
  amount?: number;
  new_status?: "todo" | "doing" | "done";
  due_date?: string;
  title?: string;
  goal_type?: "hours" | "chapters" | "days" | "one_time";
  parent_id?: string;
  new_title?: string;
}

export interface OrbitProposal {
  id: string;
  actions: ChatAction[];
  summary: string;
  status: "pending" | "applied" | "cancelled";
}

export interface OrbitReply {
  content: string;
  proposal: OrbitProposal | null; // null = no proposal, action already auto-applied
}

// Simple mock matcher — looks at message text + mentions
export function generateOrbitReply(
  userMessage: string,
  mentionedItems: Item[],
  mentionedFolders: Folder[],
  allItems: Item[],
  allFolders: Folder[],
): OrbitReply {
  const text = userMessage.toLowerCase();
  const firstMentionedItem = mentionedItems[0];

  // Pattern: "completed X lectures/units of <item>" or "done X of <item>"
  const progressMatch = text.match(
    /(?:completed|done|finished|logged|studied)\s+(?:about\s+|around\s+|~?\s*)?(\d+(?:\.\d+)?)\s*(?:lectures?|chapters?|hours?|hrs?|units?|topics?)?/,
  );

  if (progressMatch && firstMentionedItem) {
    const amount = parseFloat(progressMatch[1]);
    const newTotal = firstMentionedItem.done_units + amount;
    return {
      content: `Logged ${amount} ${firstMentionedItem.unit} to ${firstMentionedItem.title}. New total: ${newTotal} / ${firstMentionedItem.total_units} ${firstMentionedItem.unit}.`,
      proposal: null, // auto-applied
    };
  }

  // Pattern: "add task <name>" or "create <name>"
  const addTaskMatch = text.match(/(?:add|create|new)\s+(?:task|item|goal)\s+(?:called\s+|named\s+)?["']?([^"'.]+?)["']?(?:\s+(?:due|by|on)\s|$)/);
  if (addTaskMatch) {
    const title = addTaskMatch[1].trim();
    return {
      content: `Got it. I've drafted a new task "${title}" — please confirm to create it.`,
      proposal: {
        id: `prop-${Date.now()}`,
        actions: [
          {
            type: "add_item",
            risk: "ask_first",
            title,
            goal_type: "hours",
            parent_id: mentionedFolders[0]?.id ?? null,
          },
        ],
        summary: `Create new item: "${title}"`,
        status: "pending",
      },
    };
  }

  // Pattern: "rename <item> to <new name>" or "rename <folder>"
  const renameMatch = text.match(/rename\s+(.+?)\s+to\s+(?:["']?)([^"'.]+?)(?:["']?)$/);
  if (renameMatch) {
    const [, oldName, newName] = renameMatch;
    const targetItem = mentionedItems[0] ?? fuzzyMatch(oldName, allItems);
    if (targetItem) {
      return {
        content: `I can rename "${targetItem.title}" to "${newName.trim()}". Please confirm — this affects ${targetItem.aliases.length + 1} alias(es).`,
        proposal: {
          id: `prop-${Date.now()}`,
          actions: [
            {
              type: "rename_folder",
              risk: "ask_first",
              folder_id: targetItem.id, // note: items don't have rename action — using rename_folder here for demo
              new_title: newName.trim(),
            },
          ],
          summary: `Rename "${targetItem.title}" → "${newName.trim()}"`,
          status: "pending",
        },
      };
    }
  }

  // Pattern: "delete <item>" or "remove <item>"
  if (/\b(?:delete|remove|trash)\b/.test(text) && firstMentionedItem) {
    return {
      content: `I can delete "${firstMentionedItem.title}" for you. This cannot be undone — please confirm.`,
      proposal: {
        id: `prop-${Date.now()}`,
        actions: [
          {
            type: "delete_item",
            risk: "ask_first",
            item_id: firstMentionedItem.id,
          },
        ],
        summary: `Delete item: "${firstMentionedItem.title}"`,
        status: "pending",
      },
    };
  }

  // Pattern: "push <item> to <date>" or "deadline to <date>"
  const deadlineMatch = text.match(/(?:push|move|extend|deadline|due)\s+(?:to|by|until)?\s*(\d{1,2}\s+\w+)/);
  if (deadlineMatch && firstMentionedItem) {
    return {
      content: `Updated deadline for ${firstMentionedItem.title} to ${deadlineMatch[1]}.`,
      proposal: null,
    };
  }

  // Pattern: "mark <item> as done/in progress/todo"
  const statusMatch = text.match(/(?:mark|set)\s+(?:it\s+)?(?:as\s+)?(done|complete|in progress|todo|in-progress)/);
  if (statusMatch && firstMentionedItem) {
    const statusWord = statusMatch[1].replace(/\s/g, "_");
    const newStatus = statusWord === "complete" ? "done" : statusWord === "in_progress" ? "doing" : statusWord as "todo" | "doing" | "done";
    return {
      content: `Marked ${firstMentionedItem.title} as ${newStatus.replace("_", " ")}.`,
      proposal: null,
    };
  }

  // Pattern: greeting or thanks
  if (/\b(?:hi|hey|hello|thanks|thank you|cheers)\b/.test(text)) {
    return {
      content: "Hi! I'm Orbit. Try something like \"Completed 2 lectures of Database Systems\" or \"Add a quiz on Friday\".",
      proposal: null,
    };
  }

  // Pattern: "help"
  if (/\b(?:help|what can you do|commands)\b/.test(text)) {
    return {
      content: "I can log progress, add or delete tasks, rename items, set deadlines, and answer questions. Just type naturally — I'll figure out the action. Use @ to mention a specific item so I always pick the right one.",
      proposal: null,
    };
  }

  // Default: ask clarification
  return {
    content: `I'm not sure what you'd like me to do. Could you rephrase? For example: "Completed 2 lectures of @Database Systems" or "Add a quiz due Friday".`,
    proposal: null,
  };
}

// Simple fuzzy matcher — checks if query appears in title or aliases
function fuzzyMatch(query: string, items: Item[]): Item | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  return (
    items.find((i) => i.title.toLowerCase().includes(q)) ??
    items.find((i) => i.aliases.some((a) => a.toLowerCase().includes(q))) ??
    null
  );
}

export function applyProposal(proposal: OrbitProposal): string {
  // Mock apply — returns confirmation text
  const action = proposal.actions[0];
  if (!action) return "Applied (no actions).";

  switch (action.type) {
    case "add_item":
      return `✓ Created "${action.title}". You can find it in your folders.`;
    case "delete_item":
      return `✓ Deleted the item. (Would be soft-deleted with archived_at in Phase B.)`;
    case "rename_folder":
      return `✓ Renamed to "${action.new_title}".`;
    default:
      return `✓ Applied ${action.type}.`;
  }
}