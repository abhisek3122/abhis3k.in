/* =============================================================
   EDIT THIS FILE to change your homepage. Nothing else needed.
   - profile: your name + one-line bio
   - links:   the stack of cards. Add / remove / reorder freely.

   Each link:
     {
       title:    "LinkedIn",        // required
       subtitle: "Connect with me", // optional small text
       url:      "https://...",      // where it goes
       external: true                // true = opens new tab (↗ shown)
     }
   For your existing Blog, just paste its URL below.
   "Notes" points internally to notes/ — leave as-is.
   ============================================================= */

window.SITE = {
  profile: {
    name: "Abhisek Rajkumar",
    bio: "aka damnwhere. Security Consultant at NetSPI, mostly breaking into networks and interrogating Active Directory until it confesses. Currently learning my way around Azure pentesting. Past lives include web, API, and mobile testing. Reported bugs to Google, Zoho, and Brave, with an Android CVE to show for it (CVE-2023-21035). Hosts The Abhisek Cast, a podcast on the security topics that don't get talked about often enough, currently on a coffee break. Writes here when a thought needs more room than a chat message: research, notes, and the occasional overthink.",
  },

  // Contact line shown under the bio. Set to "" to hide it.
  contactEmail: "abhisek3122@gmail.com",

  // Shown in the footer. Edit to taste.
  footer: "Built by me and an AI that took half the credit and all of the blame.",

  // The little button that shows/hides the bio. Edit to taste.
  bioToggle: "the part where I talk about myself",

  links: [
    { title: "Blog",            subtitle: "My technical writings",                  url: "https://blog.abhis3k.in/", external: true },
    { title: "Notes",           subtitle: "Informal notes from my life",           url: "notes/",                   external: false },
    { title: "The Abhisek Cast", subtitle: "My cybersecurity podcast",             url: "https://creators.spotify.com/pod/profile/theabhisekcast", external: true },
    { title: "GitHub",          subtitle: "Code & projects",                       url: "https://github.com/abhisek3122", external: true },
    { title: "LinkedIn",        subtitle: "The professional version of me",        url: "https://www.linkedin.com/in/abhisek-r/", external: true },
  ],
};
