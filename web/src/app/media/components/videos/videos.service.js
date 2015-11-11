(function () {
   'use strict';

   angular
      .module('sda.media')
      .service('VideoRepository', VideoRepository);

   /** @ngInject */
   function VideoRepository($http, $q, _) {
      var speakers = [
         {
            "id": "1",
            "name": "Susan Eastman",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": ""
         },
         {
            "id": "2",
            "name": "Andrew Pinsent",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": ""
         },
         {
            "id": "3",
            "name": "Lenn Goodman",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": "<p>LENN GOODMAN is Professor of Philosophy and Andrew W. Mellon Professor in the Humanities at Vanderbilt University. His books include <cite>Creation and Evolution</cite>; <cite>Islamic Humanism</cite>; <cite>In Defense of Truth: A Pluralistic Approach</cite>; <cite>Jewish and Islamic Philosophy: Crosspollinations in the Classic Age</cite>; <cite>Judaism, Human Rights and Human Values</cite>; <cite>God of Abraham</cite>; <cite>Avicenna</cite>; <cite>On Justice: An Essay in Jewish Philosophy</cite>; his Gifford Lectures, <cite>Love Thy Neighbor as Thyself</cite> – and, most recently, <cite>Coming to Mind: The Soul and its Body</cite>, co-authored with D. G. Caramenico; and <cite>Religious Pluralism and Values in the Public Sphere</cite>. His translations with commentary include Ibn Tufayl’s <cite>Hayy Ibn Yaqzan</cite>; Saadiah Gaon’s <cite>Book of Theodicy</cite>, a commentary on the Book of Job; and, with Richard McGregor, <cite>The Case of the Animals vs Man before the King of the Jinn</cite>, a tenth century Arabic ecological fable. Goodman and his colleague Philip Lieberman are now preparing a new translation and commentary of Maimonides’ <cite>Guide to the Perplexed</cite>. A winner of the American Philosophical Association’s Baumgardt Prize, the Gratz Centennial Prize, and Vanderbilt’s highest research award, the Sutherland Prize, Goodman lives in Nashville with his wife Roberta.</p>"
         },
         {
            "id": "4",
            "name": "Timothy McGrew",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": "<p>TIMOTHY MCGREW is Professor of Philosophy at Western Michigan University, where he specializes in epistemology, history and philosophy of science, and philosophy of religion. His recent publications include <cite>Internalism and Epistemolgy</cite> (with Lydia McGrew; Routledge, 2007), <cite>The Philosophy of Science: An Historical Anthology</cite> (with Marc Alspector-Kelly and Fritz Allhoff; Blackwell, 2009), \"The Argument from Miracles\" in William Lane Craig and J. P. Moreland, eds., <cite>The Blackwell Companion to Natural Theology</cite> (Blackwell, 2009), the article on \"Miracles\" in the <cite>Stanford Encyclopaedia of Philosophy</cite> (2010), the article on \"Evidence\" in Sven Bernecker and Duncan Pritchard, eds., <cite>The Routledge Companion to Epistemology</cite> (Routledge, 2011), \"The Reliability of Witnesses and Testimony to the Miraculous,\" with Lydia McGrew, in Jake Chandler and Victoria Harrison, eds., <cite>Probability in the Philosophy of Religion</cite> (Oxford, 2012), and \"The Argument from Silence,\" <cite>Acta Analytica</cite> 29 (2014).</p>"
         },
         {
            "id": "5",
            "name": "Peter Harrison",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": "<p>PETER HARRISON is Research Professor and Director of the Centre for the History of European Discourses at the University of Queensland, Australia.  Previously he was the Andreas Idreos Professor of Science and Religion at the University of Oxford, where he was also Director of the Ian Ramsey Centre. He has published extensively in the area of intellectual history with a focus on the philosophical, scientific and religious thought of the early modern period, and on the historical relations between science and religion.  His five books include, most recently, Wrestling with Nature: From Omens to Science (Chicago, 2011)—an edited collection that surveys conceptions of science from antiquity to the present—and The Cambridge Companion to Science and Religion (Cambridge, 2010).  He has published over 70 articles and book chapters. His 2011 Gifford Lectures will be published next year by the University of Chicago Press under the title The Territories of Science and Religion.  His current research focuses on conceptions of progress in history and the historical sciences.</p>"
         },
         {
            "id": "6",
            "name": "Ignacio Silva",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": ""
         },
         {
            "id": "7",
            "name": "Craig Keener",
            "affiliation": "professor of New Testament at Asbury Theological Seminary",
            "email": "",
            "photo": "",
            "bio": "<p>CRAIG KEENER is professor of New Testament at Asbury Theological Seminary. He has authored seventeen books, four of which won significant awards in the United States, and more than seventy academic articles. The longest of these, his four-volume Acts commentary, comprises roughly 4500 pages and cites some 50,000 references from ancient sources, as well as citing more than ten thousand different secondary sources. His two-volume work, Miracles: The Credibility of the New Testament Accounts, is 1172 pages and cites more than four thousand secondary sources. His most popular work, offering ancient background information on each passage of the New Testament, is some 800 pages and has sold more than half a million copies. His other works include a short commentary on Paul’s Corinthian correspondence for Cambridge; an 831-page work on historical Jesus research; a two-volume commentary (1636 pages) on the Fourth Gospel; a commentary on the first Gospel (1040 pages); and several other works. His wife, Médine Moussounga Keener, is from the Republic of Congo and completed her PhD in Paris; they have two children, David and Keren.</p>"
         },
         {
            "id": "8",
            "name": "Colin McGinn",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": "<p>COLIN MCGINN’s interests include philosophy of mind, metaphysics, epistemology, philosophy of language, ethics, philosophy of physics, and the philosophy of literature and film. He has taught at Rutgers University, Oxford University and University College London, among other places. He has published over twenty books, ranging from consciousness to evil, Shakespeare to sport, film to logic, Wittgenstein to imagination. He has written extensively for the general reading public, as well as publishing two novels. He lives in Miami, where he paddles and plays tennis.</p>"
         },
         {
            "id": "9",
            "name": "Roger Scruton",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": ""
         },
         {
            "id": "10",
            "name": "Alister McGrath",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": "<p>ALISTER MCGRATH is Andreas Idreos Professor of Science and Religion at Oxford University. He holds three Oxford doctorates: A DPhil from the Faculty of Biological Sciences in molecular biophysics, a DD for research in historical and systematic theology from the Faculty of Theology, and a DLitt for research in science and religion from the Division of Humanities. His specialist interests include the philosophy of explanation in science and religion, the theological application of a \"critical realist\" epistemology, and the development of natural theology as an interface between theology, sciences, and the arts. His most recent book Emil Brunner: A Reappraisal (2014) is a critical study of the development of the theology of the Swiss theologian Emil Brunner, focussing especially on his approach to natural theology, and the interface between theology and the natural sciences. Following the huge critical and popular success of his recent biography of CS Lewis (2013), McGrath is also researching the origins and development of Lewis's distinct views on the relation of science and faith.</p>"
         },
         {
            "id": "11",
            "name": "William Drees",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": ""
         },
         {
            "id": "12",
            "name": "Robert Russell",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": "<p>ROBERT RUSSELL is Founder and Director of the Center for Theology and the Natural Sciences (CTNS) and the Ian G. Barbour Professor of Theology and Science in Residence at the Graduate Theological Union, Berkeley, CA. He is a leading researcher and spokesperson for the growing international body of theologians and scientists committed to a positive dialogue and creative mutual interaction between these fields. He is the author of <cite>Time in Eternity: Pannenberg, Physics and Eschatology in Creative Mutual Interaction</cite> (University of Notre Dame Press, 2012) and <cite>Cosmology from Alpha to Omega: The Creative Mutual Interaction of Theology and Science</cite> (Fortress Press, 2009). He co-edited a six volume CTNS/Vatican Observatory series on scientific perspectives on divine action and the first in the new series on scientific perspectives on the problem of natural evil. He is a founding co-editor of the scholarly journal <cite>Theology and Science</cite> which CTNS members receive internationally. Dr Russell received a Ph.D. in physics from the University of California at Santa Cruz (1978) and an M.A. and an M. Div. from Pacific School of Religion (1972). He taught physics and courses in science and religion at Carleton College, Northfield, Minnesota, before coming to the GTU in 1981.</p>"
         },
         {
            "id": "13",
            "name": "Richard Swinburne",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": "<p>RICHARD SWINBURNE is a Fellow of the British Academy. He was Nolloth Professor of the Philosophy of the Christian Religion at the University of Oxford from 1985 until 2002. He is best known for his trilogy on the philosophy of theism (The Coherence of Theism, The Existence of God, and Faith and Reason).The central book of this trilogy, The Existence of God (2nd edition, 2004) claims that arguments from the existence of laws of nature, those laws as being such as to lead to the evolution of human bodies, and humans being conscious, make it probable that there is a God. He has summarized the ideas of this trilogy in a short 'popular' book, Is There a God?  He has written a tetralology of books on the meaning and justification of central Christian doctrines (including Revelation and Providence and the Problem of Evil). He has written at various lengths on many of the other major issues of philosophy (including epistemology, the study of what makes a belief rational or justified, in his book Epistemic Justification); and he has applied his views about what is made probable to the issue of how probable it is on the evidence that Jesus rose from the dead in The Resurrection of God Incarnate. He has summarized the ideas of the later tetralogy and on the Resurrection in a second 'popular' book, Was Jesus God? He is also well known for his defence of ‘substance dualism’ (the view that humans consist of two parts –soul and body), especially in his book The Evolution of the Soul. His new book Mind, Brain, and Free Will claims that substance dualism has the consequence that humans have free will to choose between good and evil. It argues that neuroscience cannot now and could not ever show this claim to be false. He lectures frequently in many different countries.</p>"
         },
         {
            "id": "14",
            "name": "Graham Twelftree",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": "<p>GRAHAM TWELFTREE (BA, Adelaide; MA, Oxford; PhD, Nottingham) is the Charles L. Holman Professor of New Testament and Early Christianity and Director of the PhD Program in the School of Divinity at Regent University, Virginia Beach, Virginia, USA. He is a member of Studiorum Novi Testamenti Societas and the editorial board of The Journal for the Study of the Historical Jesus. His most recent book is Paul and the Miraculous: A Historical Reconstruction (Baker, 2013).</p>"
         },
         {
            "id": "15",
            "name": "Raymond Tallis",
            "affiliation": "",
            "email": "",
            "photo": "",
            "bio": ""
         }
      ];

      var playlists = [
         {
            title: 'Plenaries',
            items: [
               {
                  "id": "1",
                  "videoId": "O9EiGApcjK0",
                  "speaker": { "id":"1", "name": "Susan Eastman"},
                  "respondent": { "id":"2", "name": "Andrew Pinsent"},
                  "time": "Wednesday 16 July, 11:00am",
                  "title": "Second-Personal Knowledge of Divine Action: A View from the Apostle Paul",
                  "abstract": "<p>In this paper I shall argue that we know and recognize the presence of God in the same ways that we know and recognize other human beings as different from ourselves and yet personally engaged with us. Knowledge of divine action is not primarily inward, private, esoteric, ineffable and other-worldly but interpersonal, embodied, and embedded in communal interaction. Such an argument requires two subsidiary arguments: first, concerning the sources of our capacity for thought, including the knowledge of self and others; and second, concerning the mode of knowing and experiencing God’s action. For the first argument it will be important to clarify two contrasting approaches to infant development and problems of mind in psychology and philosophy – a first- or third-personal approach starting with the self, and a second-personal approach starting with relationship. These approaches may also be discerned in different presumptions about what constitutes the knowledge and experience of divine action, or “spiritual experience”. For the second half of my argument concerning the mode of knowing God, I will draw on the writings of the apostle Paul, in whom one finds a second-personal understanding and expression of knowing and being known by God in relationship with other people through the Spirit indwelling the community of faith.</p>"
               },
               {
                  "id": "2",
                  "videoId": "waxSBeqbzOI",
                  "speaker": { "id":"3", "name": "Lenn Goodman"},
                  "respondent": { "id":"4", "name": "Timothy McGrew"},
                  "time": "Monday 14 July, 11:00am",
                  "title": "To Make a Rainbow \u2014 God’s Work in Nature",
                  "abstract": "<p>In speaking of special divine action is one seeking to square the circle? One naturally thinks of God’s work in nature either in terms of nature’s constancy or in terms of dramatic disruptions of a pattern still, somewhat paradoxically, seen as evidence of God’s wisdom. In the first case one runs the risk of Saint Exupery’s little prince, who thinks he rules his little world because he commands the sun to rise – but only when he knows it will. Is the wilful tyrant wiser, who presumes his power real only when his actions are outrageous or untoward? Those who imagine nature as fixity risk implying a block universe, as Maimonides cautioned. We see that error not just in Aristotle’s unchanging heavens or the unchanging species of classical biology but also in Monod’s strange definition of life in terms of constancy, or in the misnomer of the term ‘reproduction’ – as though our offspring were our replicas. Still, the disruptive view leans hard on subjectivity, making God the reflex of our needs, a genie, to be invoked in desperate want or fear but otherwise best left alone – in Aristotle’s terms, a <em>deus ex machina</em>. The third option is to recognize God’s creativity in the birth of stars, and in evolution, in the rise of consciousness and human freedom and creativity, echoing God’s creativity and freedom. The hallmark of such emergence is the necessity of empiricism in science: We cannot capture a priori how God must work in nature.</p>"
               },
               {
                  "id": "3",
                  "videoId": "M4fVLvq37BE",
                  "speaker": { "id":"5", "name": "Peter Harrison"},
                  "respondent": { "id":"6", "name": "Ignacio Silva"},
                  "time": "Tuesday 14 July, 9:00am",
                  "title": "Natural Causes, Divine Action, and Scientific Explanation",
                  "abstract": "<p>Scientific explanation is routinely understood to be governed by the principle of methodological naturalism, which excludes putative supernatural causes.  This conception of naturalism is dependent on a distinction between natural and supernatural which in modern discussions is regarded as largely unproblematic.  However, the natural-supernatural distinction has an important history that shows how interdependent these notions once were.   In the past, ideas about the relative self-sufficiency of the natural realm typically relied upon deeper theological or metaphysical assumptions that could not themselves be established by naturalistic methods.  In the Middle Ages, when the natural-supernatural distinction first emerged, divine action was an integral component of natural causation.   Subsequently, during the scientific revolution, the introduction of the modern conception of laws of nature, understood as divine dictates, collapsed the natural-supernatural distinction, effectively erasing the notion of natural causes.  This early modern effacing of any real distinction between natural and supernatural causation paradoxically laid the foundations for a modern science that would later be understood in purely naturalistic terms.  Viewed historically, scientific naturalism is indebted to particular notions of divine action.</p>"
               },
               {
                  "id": "4",
                  "videoId": "LYBnJF2P_WQ",
                  "speaker": { "id":"7", "name": "Craig Keener"},
                  "respondent": { "id":"4", "name": "Timothy McGrew"},
                  "time": "Monday 14 July, 4:30pm",
                  "title": "Miracle Reports in the Gospels and Today",
                  "abstract": "<p>Virtually all substantial ancient sources about Jesus, including those from his detractors, recognize that his contemporaries experienced him as a healer. Some multiply-attested reports of his activity appear particularly dramatic, including healing blindness, resuscitating some dead persons, and on rare occasions what modern scholars call nature miracles. Such accounts comprise perhaps one-third of the earliest extant Gospel, yet they are also a major reason for many traditional critics suspecting the reliability of the gospel tradition. Paradoxically, most scholars today do believe that Jesus’s contemporaries experienced him as a healer, however we explain these experiences.</p> <p>That even first-hand witnesses can claim to experience such events, however, can no longer be credibly denied. Varieties of explanations exist (e.g., cures of psychosomatic disorders), and various levels of explanation are also possible (e.g., some argue for a deity working through natural causes). However explained, surveys suggest that hundreds of millions of people today claim to have witnessed what they consider divine healing. Moreover, millions of people have changed centuries of ancestral allegiances on the basis of such experiences. As in the gospel tradition, these experiences do include even healing of blindness, resuscitation of some dead persons through prayer, and occasionally what their reporters consider nature miracles. Some experiences go beyond the gospel tradition in reporting instant or nearly instant visible changes such as vanishing goitres. Such reports challenge traditional scepticism of the Gospel accounts. Depending on how they are understood, some experiences could also challenge Hume’s presumption against sufficient credible witnesses regarding miracles.</p>"
               },
               {
                  "id": "5",
                  "videoId": "MC8VKijydMU",
                  "speaker": { "id":"8", "name": "Colin McGinn"},
                  "respondent": { "id":"9", "name": "Roger Scruton"},
                  "time": "Tuesday 17 July, 8:00pm",
                  "title": "Mysterianism and the Mind of God",
                  "abstract": "<p>Which aspects of God’s mind are mysterious and which are not? Do the mysteries of God’s mind parallel the mysteries of the human mind? The mystery of the mind-body connection will not apply to God’s mind, since God has no material body-- though the consciousness of God itself might pose mysteries in its own right, such as the mystery of intentionality. But the mystery of free will can be expected to apply equally to God, as it does to humans. How God can have free will in a world either deterministic or indeterministic is just as problematic as the analogous problem for human freedom. On the other hand, all is not mysterious, either for humans or for God, since some mental faculties do admit of understanding: the language faculty, logical reasoning, geometrical competence, and moral and social cognition. God presumably possesses each of these faculties, and so the theories that apply to humans will carry over to God, mutatis mutandis. For instance, God’s language faculty will involve a combinatorial system built from a finite base and extending to infinity.</p> <p>As to the problem of divine intervention in the natural world, I see no metaphysical reason why this should be more difficult to understand than the intervention of the human will in the natural world (which is not to say that this problem is easy). In both cases we are confronted with a physical world governed by natural laws that appear to proceed without volitional causation—how then can volitional acts, human or divine, affect what happens in the natural world?</p>"
               },
               {
                  "id": "6",
                  "videoId": "TXqhB_RqEzI",
                  "speaker": { "id":"10", "name": "Alister McGrath"},
                  "respondent": { "id":"9", "name": ": Roger Scruton"},
                  "time": "Monday 14 July, 9:00am",
                  "title": "Understanding Cultural and Theological Resistance to Special Divine Action",
                  "abstract": "<p>This lecture explores some concerns about the notion of Special Divine Action (SDA) within mainline English religious circles from about 1650 to 1800, focussing on three interconnected developments. In the first place, the increasingly rational culture of this period appears to have created a prejudice against the idea of SDA. Second, the growing emphasis on the \"lawlike\" behaviour of the natural world created anxiety about the notion of SDA, partly because this appeared to contravene the frameworks of regularity that were coming to be valued around this time.</p><p>SDA was something that had indeed happened in the primordial act of creation; yet many now regarded God as governing the world not through \"signs and wonders\", but through the laws of nature. Third, many theologians of this age were apprehensive about the rationality of the doctrine of the Trinity, and tended to think of God in non-interventionist terms. These trends will be discussed in the writings of theologians from Newton to Paley, and their mutual relationship and significance assessed. Finally, their relevance for contemporary discussions of the question will be assessed.</p>"
               },
               {
                  "id": "7",
                  "videoId": "EMjg86wlGU0",
                  "speaker": { "id":"4", "name": "Timothy McGrew"},
                  "respondent": null,
                  "time": "Sunday 13 July, 4:30pm",
                  "title": "Special Divine Action: The Uses of History and the State of the Art",
                  "abstract": "<p>The subject of special divine action, once a vigorous field of academic discussion and debate, fell into comparative neglect in the 20th century as Hume’s famous essay became, in many places, the only piece anyone was required to read on the subject. Recent work, however, has shaken this consensus severely and brought Hume’s reasoning under heavy fire, providing a welcome opportunity to reopen the subject. For this purpose, it is important to revisit the long history of the discussion, a history that not only anticipates many modern moves but also includes perspectives that can, properly appreciated, advance the state of the art.</p>"
               },
               {
                  "id": "8",
                  "videoId": "cisqTJWDIWI",
                  "speaker": { "id":"12", "name": "Robert Russell"},
                  "respondent": { "id":"11", "name": "Willem Drees"},
                  "time": "Tuesday 15 July, 4:30pm",
                  "title": "Does 'the God Who Acts' Really Act? A Theory of Non-Interventionist Objective Divine Action (NIODA) in Light of Contemporary Science",
                  "abstract": "<p>In a mechanistic world, such as dominated the modern period due in large measure to the resounding success of Newtonian science, all natural events were understood to occur deterministically from lock-step, natural causes. If God were to act, beyond creating and sustaining the universe, in special ways to alter the course of nature, God’s action would be considered ‘miraculous’ (in the Humean sense, at least): an objective intrusion into or suspension of the flow of natural processes and a violation of the laws of nature as discovered by science. Beginning in the twentieth century, however, philosophical arguments have been made that the natural sciences now can be interpreted in ways that allow for objective divine action that is non-interventionist (i.e., non-miraculous). In this lecture I will explore a variety of approaches to NIODA, assessing their relative fruitfulness and considering the challenges to them. I will argue that quantum mechanics, and thus ‘bottom-up causality,’ provides the most promising such approach.</p>"
               },
               {
                  "id": "9",
                  "videoId": "SICB7oI2iwg",
                  "speaker": { "id":"9", "name": "Roger Scruton"},
                  "respondent": { "id":"15", "name": "Raymond Tallis"},
                  "time": "Wednesday 16 July, 9:00am",
                  "title": "What is it for a prayer to be answered?",
                  "abstract": "Problems about special divine action trouble our understanding of prayer. Even if God hears our prayers, what can he do about them? Many prayers are for rectification of the past - 'Let it not be that she has drowned', e.g. the fervent prayers of the relatives of those on the Malaysian airliner come to mind. There seems to be a distinction between prayers relating to actions and resolutions of one's own, in which one calls for a strengthening of one's own will, and prayers addressed solely to the will of God. I explore the phenomenology of prayer, with a view to understanding just what 'the will of God' might mean in this context."
               },
               {
                  "id": "10",
                  "videoId": "jnxMwF5Frto",
                  "speaker": { "id":"13", "name": "Richard Swinburne"},
                  "respondent": { "id":"15", "name": "Raymond Tallis"},
                  "time": "Tuesday 15 July, 11:00am",
                  "title": "The Probability of the Resurrection of Jesus",
                  "abstract": "<p>God has major reasons for intervening in human history by becoming incarnate himself – to identify with our suffering, to provide atonement for our sins, and to reveal truths. Given there is at least a significant probability that there is a God, there is at least a modest probability that he would become incarnate and live a life and provide teaching appropriate to one who sought thereby to realise these goals. Jesus lived and taught in the appropriate way. If it was God incarnate who did so live and teach, he would need to show us that it was God who had done so, and so could be expected to put his signature on that life and teaching by a super-miracle, such as the Resurrection. So there is a modest prior probability in advance of considering the direct historical evidence of the Resurrection, to expect that it would happen to someone who lived and taught as Jesus did. Jesus is the only person in human history about whom there is significant evidence both that he led the appropriate kind of life, and that his life was culminated by a super-miracle. So we do not need too many witnesses to the empty tomb or too many witnesses who claimed to have talked to the risen Jesus, to make it probable that Jesus did indeed rise. We do have some such witness evidence, which it is very improbable would occur (in connection with someone who led the appropriate sort of life) unless the Resurrection occurred. In consequence it is overall very probable that the Resurrection occurred.</p>"
               },
               {
                  "id": "11",
                  "videoId": "oTqpMoG94AU",
                  "speaker": { "id":"14", "name": "Graham Twelftree"},
                  "respondent": { "id":"7", "name": "Craig Keener"},
                  "time": "Sunday 13 July, 8:00pm",
                  "title": "The Historian and the Miraculous",
                  "abstract": "Although Søren Kierkegaard insisted that faith did not depend on history and miracle came to be seen as irrelevant in describing early Christianity, at least the postmodern turn and the increasing sociological significance of the Pentecostal and Charismatic movements with their testimony of miracle have increasingly brought the topic of miracle back to the fore in historiography. In an attempt to make a case that historians may be justified in judging whether or not a reported event can be described as a miracle, this presentation takes into account a number of points at which the work of the historian and the problem of miracle intersect: the postmodern challenge to realist history, the hegemony of confessional secular history, the emic history that avoids the problem of miracle, the problem of potential divine intervention for scientific enquiry, the historian and the unique event, and the question of the historian’s ability to identify supernatural agency, for example."
               }

            ]
         }
      ];

      this.getSpeaker = getSpeaker;
      this.getVideo = getVideo;
      this.getPlaylists = getPlaylists;



      function getSpeaker(id) {
         var speaker = _.findWhere(speakers, { id: id });
         return speaker ? $q.resolve(speaker) : $q.reject('speaker not found');
      }

      function getVideo(id) {
         var video = _.chain(playlists)
            .pluck('items')
            .flatten()
            .findWhere({ id: id })
            .value();

         return video ? $q.resolve(video) : $q.reject('video not found');
      }

      function getPlaylists() {
         var ytIds = _.chain(playlists)
            .pluck('items')
            .flatten()
            .pluck('videoId')
            .value();

         // create mapping of youtubeId => image URL
         var imgUrlByIdP = getYoutubeInfo(ytIds)
            .then(function (ytData) {
               return _.chain(ytData)
                  .map(function (ytVideo) {
                     return [ytVideo.id, ytVideo.snippet.thumbnails.medium.url];
                  })
                  .zipObject()
                  .value();
            });

         return imgUrlByIdP.then(function (imgUrlById) {
            playlists.forEach(function (playlist) {
               playlist.items.forEach(function (item) {
                  item.image = imgUrlById[item.videoId];
               });
            });

            return playlists;
         });
      }

      function getYoutubeInfo(youtubeIds) {
         if (!Array.isArray(youtubeIds)) {
            youtubeIds = [youtubeIds];
         }

         return $http.get('https://www.googleapis.com/youtube/v3/videos', {
               params: {
                  part: 'snippet',
                  id: youtubeIds.join(','),
                  key: 'AIzaSyAYF1hMOxcZDEoMeQKXpQ4X3H2km4SNUP0'
               }
            })
            .then(function (resp) {
               return resp.data.items;
            });
      }
   }

})();
