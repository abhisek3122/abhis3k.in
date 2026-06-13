<!-- date: 2026-03-06 -->
<!-- subtitle: Open Authorization Security 102 -->
# Exploring the Attack Surface of Open Authorization 2.1

Welcome to **Exploring the Attack Surface of Open Authorization 2.1**. This blog assumes that you have already read my previous post (https://blog.abhis3k.in/concept/&/testcases/2025/05/23/oauth-concept-and-testcases/), so if you haven’t checked that out yet, I highly recommend reading it first, as this post builds on top of those concepts.

Here, we’ll be exploring what kind of **attack vectors and research areas** can be pursued around OAuth 2.1. Hope you enjoy reading it.

![Exploring Open Authorization 2.1](main.png)

**Disclaimer:** All of this is based on my personal understanding and exploration of the topic while reading about OAuth and security. Some points may be incorrect, and feel free to disagree or point them out. I’m always open to discussion.

#### Chapter 1: <br/>Digging in Some History and OAuth 2.1

Even at this moment, **OAuth 2.1** remains in the draft stage, and its implementation is more of a choice or interest for vendors to adopt at this point. But guess what, we’ll still dig into it, as it looks like it significantly improves the overall security posture and is definitely worth understanding even in this premature phase.

Another reason to explore is that **OAuth 2.0 was originally released back in 2012**, and after more than a decade of real-world usage, many security lessons and improvements have emerged. Understanding how OAuth is evolving, helps us see how those security gaps are being addressed.

That’s actually a good habit to develop as a security professional. Exploring technologies while they are still evolving helps you understand how new security mechanisms are emerging and allows you to stay ahead of others.

**Fun fact:** It’s hard to keep up with OAuth 2.0 because there are too many different RFCs, and several parts remain optional to implement rather than being mandatory. However, this optional nature has allowed a large number of platforms to adopt OAuth because of the flexibility it provides.

There has also been an evolution in the recommendations around OAuth 2.0, including additions, removals, and changes to different grant types and their extensions. This shift happened over time as the ecosystem matured and new security concerns were discovered. This is clearly explained in this blog by Aaron Parecki (https://aaronparecki.com/2019/12/12/21/its-time-for-oauth-2-dot-1). Take your time to read it and come back here.

So the **OAuth 2.1 draft** is more of a consolidation effort. It does not introduce any new or experimental flows, but instead focuses on keeping only the flows and recommendations that are considered secure.

Another important aspect is that it reduces the need to refer to multiple documents to understand the best practices. OAuth 2.1 aims to bring these recommendations together so that developers can rely on one streamlined and secure baseline.

#### Chapter 2: <br/>So, What's interesting about OAuth 2.1?

Newer standards, and evolving recommendations usually mean one thing in security: **new types of attack vectors**. That makes this a good place to begin research and exploration.

Since we understood that **OAuth 2.1** is more of a consolidation effort, there is still a high chance that grant types which are no longer recommended will continue to exist in implementations with warnings (I came across this point in this blog, https://fusionauth.io/blog/whats-new-in-oauth-2-1). **So, How about exploring downgrade attacks (or) just forcing insecure grant types?**

To cut down the detailed discussions, here’s a **TLDR of OAuth 2.1**. You would already be familiar with this if you read the blogs mentioned above. 

As of **March 6th, 2026**, The grant types planned to be present in **OAuth 2.1** are:
- Authorization Code with PKCE
- Client Credentials
- Device Grant

Few other remarkable changes include:
- Redirect URIs must be compared using exact string matching **(Let's play around the regex and break maybe?)**
- Bearer token usage omits the use of bearer tokens in the query string of URIs **(Does the old query parameters still work?)**
- Refresh tokens must either be sender-constrained or one-time use **(Why not the re-use the token for second time?)**

#### Chapter 3: <br/>Okay, Are These Attacks / Assumptions  Even Possible?

Hmm, the OAuth flow is widely adopted by many different vendors. Each vendor builds and implements it in their own way, with different teams working on different parts of the system. That’s exactly why these assumptions are worth considering in the first place.

All the questions highlighted above are based on the possibility that something was **missed, forgotten, or left behind in the codebase** after certain features were removed or deprecated. And this is not just a theory. Even today, many vulnerabilities occur because deprecated functionalities, parameters, or legacy logic still exist somewhere in the system.

So now, let’s dig into those questions I raised above.

#### Question 1: <br/>How about exploring downgrade attacks (or just forcing insecure grant types)?

Let’s assume an OAuth implementation enforces the **Authorization Code grant**, which usually starts with the parameter `response_type=code`. This tells the authorization server that the flow should return an authorization code at the end.

Now imagine trying to force it into an **Implicit flow** instead. All it would take is changing the parameter to `response_type=token`, which would shift the flow toward returning an access token directly.

This doesn’t necessarily mean it will work. But what if the developer forgot to remove the old logic that handled implicit flows? What if the system still accepts it somewhere in the backend?

This may not immediately result in a vulnerability, but it can indicate that the vendor hasn’t fully removed deprecated logic. And if that behavior exists here, it might exist elsewhere too, such as with deprecated functionalities, parameters, or legacy code paths.

#### Question 2: <br/>Let’s play around with regex and try breaking it?

Regex is always a fun place to experiment because it relies on **pattern matching**, and small mistakes can lead to interesting bypasses.

For example, imagine the application checks the `redirect_uri` using a regex that expects `example.com`. What if something like `itsmeexample.com` passes the check?  
Or `example.com.itsme.com`?

These types of attacks are not new. They have appeared many times in bug bounty reports where improper regex validation allowed attackers to bypass restrictions.

#### Question 3: <br/>Do the old query parameters still work?

This is another classic test. If a parameter existed in an earlier version of the system, there’s always a possibility that it was **never fully removed**. For developers, it’s often easier to leave old code paths as they are instead of fully refactoring them.

Of course, proper QA and testing processes should catch this. But history has shown that legacy parameters sometimes remain functional even after they are officially deprecated. So it’s always worth checking whether **old or undocumented parameters** still influence the OAuth flow.

#### Question 4: <br/>What about reusing tokens a second time?

Again, this follows the same idea. Try reusing tokens and observe what happens. Sometimes it may work, sometimes it may not. It depends entirely on how the token lifecycle is implemented.

There are many real-world examples of token reuse issues:
- Account activation links being reused to re-enable disabled accounts
- Password reset tokens being reused multiple times   
- Magic login links working beyond their intended lifecycle

All of these attacks revolve around **identifiers or tokens that were expected to be single-use but weren’t enforced properly**.

#### Chapter 4: <br/>Closing thoughts!

So you get the point. All of these ideas are **assumptions worth exploring**. They are not guaranteed to be exploitable vulnerabilities, but they can often be the first step toward discovering inconsistencies in the system.

And that’s the whole point of this kind of research. The more we explore these edge cases and assumptions, the more we can identify gaps and improve the overall security of these systems.

Thanks for reading, Happy research!
