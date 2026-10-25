# Portföy ve yönetim paneli kullanım rehberi

Bu rehber mevcut yerel uygulamanın davranışına göre hazırlanmıştır. Paneldeki düğmelerin İngilizce adları, ekranda bulabilmen için aynen kullanılmıştır.

## 1. Portföy, Studio ve proje kartı arasındaki fark

| Gördüğün şey | Ne işe yarar? | Kim kullanır? |
| --- | --- | --- |
| Ana sayfa ve Projects bölümü | Çalışmalarını ziyaretçilere tanıtır | Ziyaretçiler |
| Bir projenin detay sayfası | Teknik açıklama, kaynak kod ve görselleri gösterir | Ziyaretçiler |
| `/admin` adresindeki Portfolio Studio | Proje bilgilerini ve yazılarını düzenler | Sen, yerel bilgisayarında |
| Projects içindeki Portfolio & Studio kartı | Bu portföyün nasıl geliştirildiğini anlatan örnek bir proje yazısıdır | Ziyaretçiler |

**Portfolio & Studio kartı yönetim panelinin kendisi değildir.** Kartı göstermek zorunda değilsin. Arşivlesen bile `/admin` paneli çalışmaya devam eder. Bu kart, portföyü geliştirmenin de bir yazılım projesi olduğunu göstermek için eklenmiştir.

Yerel gezinme menüsündeki **Studio ↗** bağlantısı ise gerçek yönetim paneline gider. Bu menü bağlantısı ve panelin kodu üretim derlemesine dahil edilmez.

## 2. Siteyi ve paneli açmak

Portföy klasöründe terminal aç:

```powershell
cd C:\Users\W11\Desktop\portfolio
npm run dev
```

Geliştirme sunucusu açıkken:

- Ana sayfa: `http://127.0.0.1:5174/`
- Yönetim paneli: `http://127.0.0.1:5174/admin`
- Örnek proje: `http://127.0.0.1:5174/projects/kutlang`

Terminali açık bırak. Sunucuyu durdurmak için o terminalde `Ctrl+C` kullanabilirsin. Panelde kaydedilen site dosyaları terminali kapatınca silinmez.

`127.0.0.1`, üzerinde tarayıcıyı açtığın bilgisayarı gösterir. Telefonundan aynı adresi yazmak bilgisayarındaki siteyi açmaz. Canlı internet siten, yerel geliştirme sunucusu kapalıyken de hosting üzerinden çalışmaya devam eder.

Port doluysa önce mevcut adresi açmayı dene; sunucu zaten çalışıyor olabilir. Taslakların tarayıcı adresine bağlı olduğu için sebepsiz yere port veya hostname değiştirme. `localhost:5174` ile `127.0.0.1:5174` bile ayrı taslak depolarıdır.

## 3. En önemli ayrım: taslak, dosyaya kayıt ve yayın

| Aşama | Ne olur? | Canlı site değişir mi? |
| --- | --- | --- |
| Panelde yazmak | Değişiklik bu tarayıcıdaki taslağa kaydolur | Hayır |
| Add image | Görsel hemen bilgisayardaki medya klasörüne yazılır; bağlantısı taslağa eklenir | Hayır |
| Save to site | Proje bilgileri ve yazı yerel proje dosyalarına yazılır | Hayır |
| Git commit | Seçtiğin dosya değişikliklerinin sürümü kaydedilir | Hayır |
| Git push | Commit'ler GitHub'a gönderilir | Bağlı Cloudflare dağıtımını başlatabilir |
| Başarılı Cloudflare dağıtımı | Yeni üretim dosyaları yayına alınır | Evet |

**Save to site, “internette yayınla” anlamına gelmiyor.** Panel şu anda otomatik commit veya push yapmıyor.

## 4. Panelin sol tarafını anlamak

### ON YOUR SITE

Yerel proje dosyalarında kayıtlı projeleri listeler. Birine tıklayarak düzenleyebilirsin.

Bu başlık GitHub'ı veya Cloudflare'ı kontrol etmez. Burada görünmek, projenin canlıya çıktığının kanıtı değildir. Arşivlenmiş kayıtlar da burada kalır; altlarında **Archived · files kept** yazar.

### BROWSER DRAFTS

Bu tarayıcıda üzerinde çalıştığın düzenleme kopyalarıdır. Yeni bir proje de mevcut bir projenin düzenlemesi de burada görünebilir.

Aynı projenin iki bölümde görünmesi iki public proje oluşturmaz. Biri dosyaya kayıtlı projeyi, diğeri tarayıcıdaki düzenleme kopyasını temsil eder. Save to site yaptıktan sonra taslağın bu listede kalması normaldir.

## 5. Yeni proje eklemek

1. **+ New** düğmesine bas.
2. Aşağıdaki alanları doldur.
3. **Technical write-up** alanındaki örnek yönergeleri kendi proje yazınla değiştir.
4. Önizlemeyi kontrol et.
5. **Save to site ↗** düğmesine bas ve başarı mesajını bekle.
6. Ana sayfada projeyi ve kendi detay adresini kontrol et.

### Alanların anlamı

| Alan | Ne yazılır? | Örnek |
| --- | --- | --- |
| Project title | Ziyaretçinin göreceği proje adı | Spaceship Titanic |
| Project URL | Adresin son parçası; tam internet adresi yazılmaz | spaceship-titanic |
| Short description | Projenin ne yaptığını anlatan kısa açıklama | Predicting passenger transportation outcomes with tabular machine learning. |
| Category | Projenin konusu | Data Science |
| Project progress | Asıl projenin gelişim durumu | In progress |
| Technologies | Virgülle ayrılmış teknoloji adları | Python, pandas, XGBoost |
| GitHub repository | Projeye ait tam repo adresi; isteğe bağlı | https://github.com/Kutlay07/REPO-ADI |
| Live demo | Çalışan ayrı bir demo varsa onun adresi; isteğe bağlı | Gerçek demo adresi |

GitHub ve demo örneklerini doğrudan yayınlama. Gerçek adresin yoksa alanı boş bırakabilirsin. Erişilebilir olmasını istediğin repo bağlantısının ziyaretçilere açık olduğundan emin ol.

**Project URL kuralları:** küçük İngilizce harfler, sayılar ve arada tek tire kullan. Boşluk, Türkçe karakter, `/` veya tam URL girme. Örneğin `spaceship-titanic` geçerli; `Spaceship Titanic` uygun değil. Mevcut bir proje ile aynı URL kullanılamaz. Projeyi kaydettikten sonra URL alanı kilitlenir; başlığını değiştirebilirsin.

### Project progress ne demek?

- **Planned:** Henüz yapılması planlanıyor.
- **In progress:** Çalışma devam ediyor.
- **Completed:** Anlatılan kapsam tamamlandı.

Bu alan yayın izni değildir. **Planned** bir projeyi Save to site ile kaydedip yayınlarsan ziyaretçiler onu görebilir. Henüz göstermemek için tarayıcı taslağında bırak veya kayıtlı projeyi arşivle.

## 6. Teknik proje yazısını hazırlamak

**Technical write-up**, proje detay sayfasının uzun içeriğidir. Markdown kullanır. Yazı alanının yanındaki düğmeler:

| Düğme | Görünüm |
| --- | --- |
| Write | Yalnızca Markdown editörü |
| Side by side | Editör ve canlı önizleme |
| Preview | Yalnızca önizleme |

Dar ekranda yan yana görünümün bölümleri alt alta geçebilir. Önizleme başlığı, kısa açıklamayı ve Markdown gövdesini gösterir; son sayfanın bütün bağlantı ve durum alanlarını birebir kopyalamaz. Son kontrolü **View saved project ↗** üzerinden yap.

Başlamak için şu yapıyı kullanabilirsin:

```markdown
## Overview

Explain the problem and the goal of the project.

## Data

Describe the dataset, source, target, and important limitations.

## Approach

- Explain preprocessing decisions.
- Describe the baseline and model choices.
- Explain how training and validation were separated.

## Evaluation

| Item | Evidence |
| --- | --- |
| Validation method | Describe the split you actually used |
| Main metric | Add your recorded result |

## Lessons Learned

Discuss what worked, what did not, and what remains unfinished.
```

Bu metin bir şablondur; içindeki yönergeleri kendi açıklamalarınla değiştir. Ölçmediğin sonuçlara sayı ekleme. Bir grafik veya skor paylaşıyorsan veri, değerlendirme yöntemi ve sınırlarını da belirt.

### Temel Markdown işaretleri

| Yazım | Görünüm |
| --- | --- |
| `## Approach` | Bölüm başlığı |
| `### Data preparation` | Alt başlık |
| `**important**` | Kalın yazı |
| `- First step` | Liste maddesi |
| `[Source](https://example.com)` | Bağlantı; gerçek adresle değiştir |
| Tek ters tırnak içine alınmış kelime | Satır içi kod |

Kod örneği için üç ters tırnakla açıp kapatılan blok kullan:

````markdown
```python
prediction = model.predict(features)
```
````

Mevcut editörün Markdown kod bloğu metni kendiliğinden çalıştırmaz. Notebook veya Python scripti çalıştıran bir ortam değildir.

## 7. Grafik ve görsel eklemek

1. Grafiği notebook veya kullandığın araçtan bilgisayarına kaydet.
2. Markdown editöründe görseli istediğin konuma tıkla. Yazı görünmüyorsa önce Write veya Side by side seç.
3. **+ Add image** düğmesine bas.
4. PNG, JPEG, WebP veya GIF dosyası seç. Tek dosya 5 MB'tan küçük olmalı.
5. Editöre eklenen görsel bağlantısını ve önizlemeyi kontrol et.
6. Köşeli parantez içindeki metni görseli açıklayacak şekilde düzenle.
7. **Save to site** ile raporu kaydet.

Eklenen satır yaklaşık şöyle görünür:

```markdown
![Confusion matrix on the validation split](/project-media/otomatik-dosya-adi.png)
```

Görsel, seçildiği anda yerel medya klasörüne yazılır. Raporun içine eklenen bağlantı ise Save to site ile rapor dosyasına kaydolur. Taslağı silmek, yüklenen görsel dosyasını silmez.

PDF, notebook dosyası veya etkileşimli grafik dosyası bu düğmeyle yüklenmez. Statik grafik için PNG kullanabilir, notebook veya ayrı demo için bir bağlantı ekleyebilirsin.

## 8. Mevcut projeyi güncellemek

1. ON YOUR SITE bölümünden projeyi seç.
2. Açıklama, ilerleme durumu, teknolojiler, bağlantılar veya raporu değiştir.
3. Önizlemeyi kontrol et ve **Save to site** düğmesine bas.
4. **View saved project ↗** ile yerel sayfayı aç.
5. Hazır olduğunda Git üzerinden yayınla.

Yeni bir gelişmeyi aynı projenin raporuna eklemek için **+ New** kullanman gerekmez. Aynı projeyi seçip örneğin yeni bir `## Experiment results` bölümü ekleyebilirsin.

Dosyalar başka bir araçta değiştiğinde eski tarayıcı taslağı otomatik olarak yeni dosyalarla birleştirilmez. Güncel dosya sürümünü açmak istiyorsan önce gerekirse taslak yedeğini indir, ilgili taslağı **Discard browser draft** ile bırak ve kayıtlı projeyi yeniden seç.

## 9. Taslağı bırakmak, arşivlemek ve geri getirmek

| Düğme | Etkisi |
| --- | --- |
| Discard browser draft | Seçili tarayıcı taslağını bırakır; kayıtlı site dosyasını silmez |
| Archive project | Projeyi kaydeder ve yerel public görünümden kaldırır; dosyaları tutar |
| Restore to portfolio | Arşivli projeyi yeniden görünür yapar ve dosyaya kaydeder |

Arşivleme ve geri getirme, o anda açık olan düzenlemeyi de kaydeder. Bunların canlı sitede etkili olması için yine commit, push ve başarılı dağıtım gerekir.

### Portfolio & Studio kartını kaldırmak istersen

1. Panelin solundan **Portfolio & Studio** projesini seç.
2. **Archive project** düğmesine bas.
3. Yerel ana sayfada kartın kalktığını kontrol et.
4. Canlı siteden de kalkması için değişikliği yayınla.

Yönetim panelin çalışmaya devam eder. Kartı geri göstermek için projeyi tekrar açıp **Restore to portfolio** seç.

Arşiv, gizli belge saklama aracı değildir. Önceki yayınlar, Git geçmişi veya derleme dosyaları eski içeriği tutabilir.

## 10. Taslak yedeği almak ve geri yüklemek

### Yedek almak

**Download draft backup ↓** düğmesi `portfolio-studio-backup.json` dosyasını indirir. Bu dosya tarayıcıdaki bütün proje taslaklarını içerir.

### Geri yüklemek

1. **Restore draft backup ↑** düğmesine bas.
2. Daha önce indirdiğin JSON dosyasını seç.
3. Mevcut tarayıcı taslaklarının değiştirileceğini belirten onayı kontrol et.
4. Geri yükledikten sonra ilgili projeyi aç ve önizle.
5. İçeriğin site dosyalarına da geçmesini istiyorsan ayrıca **Save to site** kullan.

Geçersiz yedek kabul edilmez. Yedek yükleme sınırı 6 MB, kabul edilen taslak sayısı en fazla 100'dür.

**Taslak yedeği sitenin tamamının yedeği değildir.** Görselleri, uygulama kodunu ve Git geçmişini içermez. Başka bilgisayara taşırken projeyi ve medya dosyalarını da taşıman gerekir. Tarayıcı verilerini temizlemek veya gizli oturumu kapatmak taslakları kaybettirebilir; önemli taslakları dosyaya kaydet veya dışa aktar.

## 11. Canlı siteye yayınlamak

Önce yerel sayfayı kontrol et. Yayın öncesi portföy klasöründe:

```powershell
npm run lint
npm run build
npm run test:build
```

Bu komutlar canlı siteye hiçbir şey göndermez. Hata varsa önce onu çöz; başarısız derlemeyi yayına hazır kabul etme.

Normal bir içerik güncellemesinde değişiklikleri incele:

```powershell
git status
git diff --stat
git diff -- src/data/projects.json src/content/projects
```

Yeni ve izlenmeyen dosyaların içeriği normal `git diff` çıktısında görünmeyebilir; `git status` ile onları da kontrol et.

Yalnızca proje metni ve görselleri değiştiyse:

```powershell
git add src/data/projects.json src/content/projects public/project-media
git diff --cached --stat
```

Seçtiğin değişiklikler doğruysa anlamlı bir commit mesajıyla:

```powershell
git commit -m "docs: update project case studies"
git push
```

Bu komutları sen çalıştırdığında GitHub'a gönderim yapılır. Sadece rehberi okumak gönderim yapmaz.

**Mevcut büyük portföy/CMS güncellemesinin ilk yayını için:** Yukarıdaki üç içerik yolu tek başına yeterli değildir. Uygulama kodu, yeni scriptler, yapılandırma ve doküman değişiklikleri de var. VS Code'un Source Control bölümünden bütün ilgili değişiklikleri inceleyip stage et; ardından commit ve push yap. Sonraki sıradan rapor güncellemelerinde içerik odaklı komutları kullanabilirsin.

Push sonrasında Cloudflare'daki portföy projesinin dağıtım sonucunu kontrol et. Başarılı olunca canlı adresi açıp ilgili sayfayı yenile. Proje dosyasındaki bir kayıt ile internette görünen kayıt aynı sürümde olmayabilir.

## 12. Panelden neleri değiştirebilirsin?

| İçerik | Mevcut panelden değişir mi? |
| --- | --- |
| Proje adı, kısa açıklama, kategori, ilerleme | Evet |
| Teknolojiler, GitHub ve demo adresleri | Evet |
| Teknik proje raporu ve görseller | Evet |
| Projeyi arşivleme ve geri getirme | Evet |
| Ana sayfa büyük başlığı ve tanıtım metni | Hayır |
| Hakkımda metni | Hayır |
| Email adresi ve profil bağlantısı | Hayır |
| Renkler, fontlar ve sayfa düzeni | Hayır |
| Mevcut bir projenin URL'sini değiştirme | Hayır |
| Projeleri sürükleyerek sıralama | Hayır |
| Tek tuşla GitHub'a gönderme ve yayınlama | Hayır |

Panel şu anda **proje içerik yöneticisi**. Ana sayfa tasarımı veya profil metni değişikliklerini ayrıca isteyebilirsin; bunlar için React kodunu kendin yazman gerekmiyor.

## 13. Sık karşılaşılan durumlar

| Durum | Yapılacak işlem |
| --- | --- |
| `/admin` açılmıyor | `npm run dev` çalışıyor mu ve doğru yerel adreste misin kontrol et |
| Canlı adreste `/admin` yok | Beklenen davranış; panel yerel geliştirme içindir |
| Sunucu portun dolu olduğunu söylüyor | Eski sunucuyu kullan veya o terminalde Ctrl+C ile durdur |
| Kaydettim ama internet sitesi değişmedi | Commit, push ve Cloudflare dağıtımı tamamlandı mı kontrol et |
| Aynı proje iki listede görünüyor | Kayıtlı proje ile tarayıcı taslağı ayrı listeleniyor; normal |
| Project URL değişmiyor | Mevcut projelerde adres bilinçli olarak kilitli |
| URL zaten var hatası | Yeni proje açmak yerine mevcut projeyi sol listeden düzenle |
| Görsel yüklenmiyor | Desteklenen formatta ve 5 MB'tan küçük bir dosya seç |
| Kayıt alanı dolu/erişilemiyor mesajı | Taslak yedeğini indir; uygun olanları Save to site ile kaydet |
| Taslaklar kaybolmuş görünüyor | Aynı tarayıcı, profil ve `127.0.0.1:5174` adresini kullandığını kontrol et |
| Dosyaya kayıt isteği reddediliyor | Paneli tam yerel adresten aç; geliştirme sunucusunu çalıştır |
| Sayfada eski yazı açılıyor | Eski tarayıcı taslağı mı dosyadaki sürüm mü görüntüleniyor kontrol et |
| `npm run preview` içinde Studio yok | Beklenen davranış; preview üretim çıktısını gösterir |

Kayıt başarısız olduğunda editörün üstündeki mesajı oku. Başarı mesajı görmeden içeriğin dosyaya geçtiğini varsayma.

## 14. Günlük kısa kullanım

```text
npm run dev
→ /admin
→ Projeyi seç veya + New
→ Yaz, görsel ekle, önizle
→ Save to site
→ Yerel proje sayfasını kontrol et
→ Hazır olduğunda commit ve push
→ Cloudflare dağıtımını doğrula
```

Her cümlede commit atman gerekmiyor. Anlamlı bir güncelleme tamamlandığında yayınlayabilirsin. Henüz paylaşmak istemediğin yazıları tarayıcı taslağında tut; kaybolmaması için yedekle.
