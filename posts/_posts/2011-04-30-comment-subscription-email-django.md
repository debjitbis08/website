---
layout: post
title: Comment subscription by email in Django
---
<p>
  Recently I have been feeling that readers of my blog have been missing the followup comments, which is important if I
  really want to share and help. I had the option of adding a RSS feed for the comments (which I will add in a few weeks),
  but I decided that email should be implemented earlier.
</p>
<p>
  I started by adding a CommentSubscriber class which has a email field describing who subscribed and a entries (or posts)
  indicating to which entries has the reader subscribed to. This is how the class looks:
</p>
<pre><code>class CommentSubscriber(models.Model):
  entries = models.ManyToManyField(Entry)
  email = models.EmailField()

  def __unicode__(self):
      return self.email</code></pre>
<p>where Entry is describing each entry in a blog.</p>
<p>To enable the user to enter the email address, I created a simple form with just one field, email.</p>
<pre><code>class CommentSubscriberForm(forms.Form):
  email = forms.EmailField()</code></pre>
<p>
  Next I needed to add a view to show the form and handle form submission. The tricky part is avoiding duplicate entries in 
  the database while saving the entered data. The try block in the below code block tries to get a CommentSubscriber with 
  the email entered, if there is one it just adds this entry to the list of entries that this subscriber has subscribed to. 
  If there is no such subscriber a exception is raised and flow moves to the except block, here a new CommentSubscriber is 
  created and the entry is added to the subscription list.</p>
<pre><code>def subcribe_by_email(request, entry_id):
  if request.method == "POST":
      form = CommentSubscriberForm(request.POST)
      if form.is_valid():
          entry = Entry.objects.get(pk=entry_id)
          subscriber_email = form.cleaned_data['email']
          try:
              subscriber = CommentSubscriber.objects.get(email=subscriber_email)
              subscriber.entries.add(entry)
          except:
              subscriber = CommentSubscriber(
                  email = subscriber_email,
              )
              subscriber.save()
              entry.commentsubscriber_set.add(subscriber)
          return HttpResponseRedirect(entry.get_absolute_url())

  else:
      form = CommentSubscriberForm()

  return render_to_response('blog/subscribe.html', {
          'form': form,
      },
      context_instance=RequestContext(request),
  )</code></pre>
<p>
  If you are wondering where did I get the entry_id above, the answer is simple I added to the URL. The url is designed to 
  pass the entry_id to the view.
</p>
<pre><code>(r'^entry/(?P&lt;entry_id&gt;\d+)/subscribe/$', subcribe_by_email)</code></pre>
<p>Now the only thing remaining is adding a method to actually send the mails based on the data collected. First I get all 
the subscribers to the comments for this entry. To understand think about it as a SQL query like</p>
<code>SELECT email FROM comment_subscriber WHERE entries=[entry_id]</code>
<p>Then I create the subject and body of the email, which is easy. Note that I am not sending HTML emails yet, they are 
text only emails. Next I remove the commenter of the present comment (I will come back to this), from the list as 
there is not need to send the same comment as email. Then I also add admin emails, to notify myself of any comment 
posted.</p>
<p>In the next step I create a list of messages to be sent. I could have created a single message with multiple 
receipients but that would make the email addresses of the comments available to others. Please refer this page 
to understand syntax of the send_mass_mail function.</p>
<pre><code>from django.contrib.comments.signals import comment_was_posted
from django.core.mail import send_mass_mail
from django.conf import settings

def comment_notifier (sender, comment, **kwargs):

    """ Email admins when a new comment is posted """
    if comment.is_public:
        subscribers = [subscriber.email for subscriber in CommentSubscriber.objects.filter(entries=comment.content_object.id)]
        subject = "New comment for %s" % (
            comment.content_object.title)
        body = "%s had the following to say:\n%s" % (
            comment.user_name,
            comment.comment)
        if comment.user_name in subscribers:
            indx = subscribers.index(comment.user_name)
            del subscribers[indx]

        subscribers = subscribers + [admins[1] for admins in settings.ADMINS]

        messages = ()
        for subscriber in subscribers:
            messages = messages + ((subject, body, "admin@debjitbiswas.com", [subscriber]),)
        
        send_mass_mail(messages, fail_silently=False)</code></pre>
<p>
  The next is call the comment_notifier when a new comment is posted. The commenter of this comment is excluded from the 
  subscriber list before sending the mail as mentioned earlier. The last step is binding the comment_was_posted event 
  to the above function. Here is how:
</p>
<pre><code>from django.contrib.comments.models import Comment
from django.contrib.comments.signals import comment_was_posted

comment_was_posted.connect(comment_notifier, sender=Comment)</code></pre>
---
<strong>Update:</strong> This was for my old blog created from scratch on Django.