// Comments under an entry, stored in Supabase.
// Anyone can read them; posting needs an email sign-in link (no passwords).
(function () {
  var section = document.getElementById('comments');
  if (!section || !window.supabase) return;

  var post = section.dataset.post;
  var cameFromEmailLink = /access_token=/.test(location.hash);
  var client = window.supabase.createClient(section.dataset.supabaseUrl, section.dataset.supabaseKey, {
    // The link in the email carries the sign-in in the URL, so it works even
    // when opened on a different device from the one that asked for it.
    auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true }
  });

  var list = section.querySelector('.comment-list');
  var empty = section.querySelector('.comments-empty');
  var status = section.querySelector('.comments-status');
  var signinForm = section.querySelector('.comment-signin');
  var nameForm = section.querySelector('.comment-name');
  var commentForm = section.querySelector('.comment-form');
  var who = section.querySelector('.comment-who');
  var user = null;

  function say(message, isError) {
    status.textContent = message || '';
    status.hidden = !message;
    status.classList.toggle('is-error', !!isError);
  }

  function showOnly(form) {
    [signinForm, nameForm, commentForm].forEach(function (f) { f.hidden = f !== form; });
  }

  function busy(form, on) {
    Array.prototype.forEach.call(form.elements, function (el) { el.disabled = on; });
  }

  // ── Reading ────────────────────────────────────────────

  function render(comments) {
    list.innerHTML = '';
    empty.hidden = comments.length > 0;
    comments.forEach(function (c) {
      var li = document.createElement('li');
      li.className = 'comment';

      var meta = document.createElement('p');
      meta.className = 'comment-meta';
      var name = document.createElement('strong');
      name.textContent = (c.profiles && c.profiles.display_name) || 'A hunter';
      var when = document.createElement('time');
      when.dateTime = c.created_at;
      when.textContent = new Date(c.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
      meta.append(name, ' ', when);

      if (user && c.user_id === user.id) {
        var del = document.createElement('button');
        del.type = 'button';
        del.className = 'link-button comment-delete';
        del.textContent = 'Delete';
        del.addEventListener('click', function () { remove(c.id); });
        meta.append(' ', del);
      }

      var body = document.createElement('p');
      body.className = 'comment-body';
      body.textContent = c.body;   // plain text only, never HTML

      li.append(meta, body);
      list.appendChild(li);
    });
  }

  function loadComments() {
    return client
      .from('comments')
      .select('id, body, created_at, user_id, profiles(display_name)')
      .eq('post', post)
      .order('created_at')
      .then(function (res) {
        if (res.error) throw res.error;
        render(res.data);
      });
  }

  // ── Who's here? ────────────────────────────────────────

  function refresh(session) {
    user = session ? session.user : null;
    var ready = user ? client.from('profiles').select('display_name').eq('id', user.id).maybeSingle() : Promise.resolve(null);

    return ready.then(function (res) {
      if (res && res.error) throw res.error;
      say('');
      if (!user) showOnly(signinForm);
      else if (!res.data) showOnly(nameForm);
      else {
        who.textContent = 'Signed in as ' + res.data.display_name;
        showOnly(commentForm);
      }
      return loadComments();
    }).then(function () {
      if (cameFromEmailLink && user) {
        cameFromEmailLink = false;
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }).catch(function (err) {
      say('Couldn’t reach the notes right now. ' + err.message, true);
    });
  }

  // ── Actions ────────────────────────────────────────────

  signinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = signinForm.elements.email.value.trim();
    busy(signinForm, true);
    client.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: location.origin + location.pathname }
    }).then(function (res) {
      busy(signinForm, false);
      if (res.error) return say(res.error.message, true);
      signinForm.hidden = true;
      say('Check your inbox at ' + email + ' and click the link to sign in. You can close this tab.');
    });
  });

  nameForm.addEventListener('submit', function (e) {
    e.preventDefault();
    busy(nameForm, true);
    client.from('profiles')
      .upsert({ id: user.id, display_name: nameForm.elements.display_name.value.trim() })
      .then(function (res) {
        busy(nameForm, false);
        if (res.error) return say(res.error.message, true);
        return client.auth.getSession().then(function (s) { return refresh(s.data.session); });
      });
  });

  commentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var body = commentForm.elements.body;
    busy(commentForm, true);
    client.from('comments')
      .insert({ post: post, body: body.value.trim() })
      .then(function (res) {
        busy(commentForm, false);
        if (res.error) return say(res.error.message, true);
        body.value = '';
        say('');
        return loadComments();
      });
  });

  function remove(id) {
    if (!confirm('Delete this note?')) return;
    client.from('comments').delete().eq('id', id).then(function (res) {
      if (res.error) return say(res.error.message, true);
      return loadComments();
    });
  }

  section.querySelector('.comment-signout').addEventListener('click', function () {
    client.auth.signOut();
  });

  // Supabase warns against calling it from inside this callback, hence setTimeout.
  client.auth.onAuthStateChange(function (event, session) {
    setTimeout(function () { refresh(session); }, 0);
  });
})();
