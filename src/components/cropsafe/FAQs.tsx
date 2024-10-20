import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { translations, TranslationKey } from "src/locales/translations";

type LanguageCode = keyof typeof translations;

interface FAQsProps {
  selectedLanguage: LanguageCode;
}

const faqsData = {
  en: [
    {
      q: "How do I create a new policy?",
      a: "Easy peasy! Just click on 'Create New Policy' from the dashboard and follow the steps. It's like ordering a pizza, but for crop insurance!",
    },
    {
      q: "How is the premium calculated?",
      a: "Our AI crunches numbers faster than you can say 'weather forecast'! It analyzes historical weather data and your policy details to cook up a fair premium.",
    },
    {
      q: "How do I file a claim?",
      a: "It's as simple as taking a selfie! Go to 'My Policies', pick the relevant policy, and hit 'File a Claim'. Our AI will take it from there.",
    },
    {
      q: "What happens after I submit a claim?",
      a: "Our AI puts on its detective hat, assesses the claim based on weather data and your evidence. You'll get the verdict faster than a thunderclap!",
    },
    {
      q: "Do I need to pay gas fees?",
      a: "Nope! We've got you covered. CropSafe uses Base chain's Paymaster to handle gas fees. It's like having a full tank of gas, always!",
    },
  ],
  th: [
    {
      q: "ฉันจะส້างกรมธรรม์ใหม่ได้อย่างไร?",
      a: "ง่ายมาก! เพียงคลิกที่ 'ส້างกรมธรรม์ใหม่' จากแดชบอร์ดและทำตามขั้นตอน. มันเหมือนกับการสั่งพิซซ่า, ແต่เป็นประกันพืชผล!",
    },
    {
      q: "เบี้ยประกันคำนวณอย่างไร?",
      a: "AI ของเราประมวลผลตัวเลขเร็วกว่าที่ท່านสามาดເวลาເวลา 'พะญากอนอากาด'! มันวิเคราะห์ข้อมูลสภาพอากาศในอดีตและรายละเอียดกรมธรรม์ของท່านເพื่อส້างคำนวณเบี้ยประกันที่เป็นธรรม",
    },
    {
      q: "ฉันจะยื่นเรื่องเรียกร้องได้อย่างไร?",
      a: "ง่ายเหมือนการถ่ายเซลฟี! ไปที่ 'กรมธรรม์ของฉัน', เลือกกรมธรรม์ที่ก່฽วข้อง, ແละกด 'ยื่นเรื่องเรียกร้อง' AI ของเราจะจัดการที่เหลือให้",
    },
    {
      q: "เกิดอะไรขึ้นหลังจากฉันส่งเรื่องเรียกร้อง?",
      a: "AI ของเราจะสวมหมวกนักสืบ, ประเมินการเรียกร้องตามข้อมูลสภาพอากาศและหลักฐานของท່าน. ท່านจะได้รับผลเร็วกว่าเสียงฟ้าร้อง!",
    },
    {
      q: "ฉันต้องจ่ายคำแก๊สไหม?",
      a: "ไม่ต้อง! เรารับผิดชอบให้ CropSafe ใช้ Paymaster ของ Base chain เพื่อจัดการคำแก๊ส. มันเหมือนกับมีถังแก๊สเต็มตลอดเวลา!",
    },
  ],
  id: [
    {
      q: "Bagaimana cara membuat polis baru?",
      a: "Sangat mudah! Cukup klik 'Buat Polis Baru' dari dasbor dan ikuti langkah-langkahnya. Ini seperti memesan pizza, tapi untuk asuransi tanaman!",
    },
    {
      q: "Bagaimana premi dihitung?",
      a: "AI kami menghitung angka lebih cepat dari Anda mengucapkan 'prakiraan cuaca'! Ia menganalisis data cuaca historis dan detail polis Anda untuk menghasilkan premi yang adil.",
    },
    {
      q: "Bagaimana cara mengajukan klaim?",
      a: "Semudah mengambil selfie! Pergi ke 'Polis Saya', pilih polis yang relevan, dan klik 'Ajukan Klaim'. AI kami akan menangani sisanya.",
    },
    {
      q: "Apa yang terjadi setelah saya mengajukan klaim?",
      a: "AI kami mengenakan topi detektifnya, menilai klaim berdasarkan data cuaca dan bukti Anda. Anda akan mendapatkan keputusan lebih cepat dari suara petir!",
    },
    {
      q: "Apakah saya perlu membayar biaya gas?",
      a: "Tidak! Kami yang tanggung. CropSafe menggunakan Paymaster dari Base chain untuk menangani biaya gas. Seperti memiliki tangki gas penuh, selalu!",
    },
  ],
  ms: [
    {
      q: "Bagaimana saya boleh mencipta polisi baru?",
      a: "Sangat mudah! Hanya klik pada 'Cipta Polisi Baru' dari papan pemuka dan ikuti langkah-langkahnya. Ia seperti memesan piza, tetapi untuk insurans tanaman!",
    },
    {
      q: "Bagaimana premium dikira?",
      a: "AI kami mengira nombor lebih pantas daripada anda boleh sebut 'ramalan cuaca'! Ia menganalisis data cuaca sejarah dan butiran polisi anda untuk menghasilkan premium yang adil.",
    },
    {
      q: "Bagaimana saya boleh memfailkan tuntutan?",
      a: "Ia semudah mengambil selfie! Pergi ke 'Polisi Saya', pilih polisi yang berkaitan, dan tekan 'Failkan Tuntutan'. AI kami akan mengambil alih dari situ.",
    },
    {
      q: "Apa yang berlaku selepas saya menghantar tuntutan?",
      a: "AI kami memakai topi detektifnya, menilai tuntutan berdasarkan data cuaca dan bukti anda. Anda akan mendapat keputusan lebih pantas daripada kilat!",
    },
    {
      q: "Adakah saya perlu membayar yuran gas?",
      a: "Tidak! Kami telah menguruskannya. CropSafe menggunakan Paymaster dari rantaian Base untuk mengendalikan yuran gas. Ia seperti mempunyai tangki gas penuh, selalu!",
    },
  ],
  vi: [
    {
      q: "Làm thế nào để tạo một hợp đồng mới?",
      a: "Dễ như ăn bánh! Chỉ cần nhấp vào 'Tạo Hợp đồng Mới' từ bảng điều khiển và làm theo các bước. Nó giống như đặt pizza, nhưng là cho bảo hiểm cây trồng!",
    },
    {
      q: "Phí bảo hiểm ��ược tính như thế nào?",
      a: "AI của chúng tôi tính toán nhanh hơn bạn có thể nói 'dự báo thời tiết'! Nó phân tích dữ liệu thời tiết lịch sử và chi tiết hợp đồng của bạn để đưa ra mức phí hợp lý.",
    },
    {
      q: "Làm thế nào để nộp yêu cầu bồi thường?",
      a: "Đơn giản như chụp ảnh selfie! Đi tới 'Hợp đồng của Tôi', chọn hợp đồng liên quan, và nhấn 'Nộp Yêu cầu Bồi thường'. AI của chúng tôi sẽ xử lý phần còn lại.",
    },
    {
      q: "Điều gì xảy ra sau khi tôi gửi yêu cầu bồi thường?",
      a: "AI của chúng tôi đội mũ thám tử, đánh giá yêu cầu dựa trên dữ liệu thời tiết và bằng chứng của bạn. Bạn sẽ nhận được kết quả nhanh hơn tiếng sấm!",
    },
    {
      q: "Tôi có cần trả phí gas không?",
      a: "Không! Chúng tôi lo cho bạn. CropSafe sử dụng Paymaster của chuỗi Base để xử lý phí gas. Giống như luôn có đầy bình xăng vậy!",
    },
  ],
  tl: [
    {
      q: "Paano ako gagawa ng bagong polisiya?",
      a: "Napakadali! I-click lang ang 'Gumawa ng Bagong Polisiya' mula sa dashboard at sundin ang mga hakbang. Parang pag-order ng pizza, pero para sa insurance ng pananim!",
    },
    {
      q: "Paano kinakalkula ang premium?",
      a: "Ang aming AI ay nagkakalkula ng mga numero nang mas mabilis kaysa sa pagsabi mo ng 'weather forecast'! Sinusuri nito ang historical weather data at ang mga detalye ng iyong polisiya para makabuo ng patas na premium.",
    },
    {
      q: "Paano ako mag-file ng claim?",
      a: "Kasing simple ng pagkuha ng selfie! Pumunta sa 'Aking mga Polisiya', piliin ang naaangkop na polisiya, at pindutin ang 'Mag-file ng Claim'. Ang aming AI ang bahala sa susunod.",
    },
    {
      q: "Ano ang mangyayari pagkatapos kong magsumite ng claim?",
      a: "Isusuot ng aming AI ang sumbrero ng detektibo, susuriin ang claim batay sa weather data at sa iyong ebidensya. Makakakuha ka ng desisyon nang mas mabilis pa sa kidlat!",
    },
    {
      q: "Kailangan ko bang magbayad ng gas fees?",
      a: "Hindi! Kami na ang bahala. Gumagamit ang CropSafe ng Paymaster ng Base chain para sa pag-handle ng gas fees. Parang laging puno ang tangke ng gas!",
    },
  ],
  km: [
    {
      q: "តើខ្ញុំបង្កើតគោលនយោបាយថ្មីដោយរបៀបណា?",
      a: "ងាយស្រួលណាស់! គ្រាន់តែចុចលើ 'បង្កើតគោលនយោបាយថ្មី' ពីផ្ទាំងគ្រប់គ្រង ហើយធ្វើតាមជំហាន។ វាដូចជាការបញ្ជាទិញភីហ្សា ប៉ុន្តែសម្រាប់ការធានារ៉ាប់រងដំណាំ!",
    },
    {
      q: "តើបុព្វលាភត្រូវបានគណនាយ៉ាងដូចម្តេច?",
      a: "AI របស់យើងគណនាលេខលឿនជាងអ្នកអាចនិយាយថា 'ការព្យាករណ៍អាកាសធាតុ'! វាវិភាគទិន្នន័យអាកាសធាតុពីមុន និងព័ត៌មានលម្អិតនៃគោលនយោបាយរបស់អ្នក ដើម្បីបង្កើតបុព្វលាភដែលយុត្តិធម៌។",
    },
    {
      q: "តើខ្ញុំដាក់ពាក្យទាមទារសំណងដោយរបៀបណា?",
      a: "វាងាយស្រួលដូចការថតរូបខ្លួនឯង! ទៅកាន់ 'គោលនយោបាយរបស់ខ្ញុំ' ជ្រើសរើសគោលនយោបាយដែលពាក់ព័ន្ធ ហើយចុច 'ដាក់ពាក្យទាមទារសំណង'។ AI របស់យើងនឹងទទួលបន្តពីនោះ។",
    },
    {
      q: "តើមានអ្វីកើតឡើងបន្ទាប់ពីខ្ញុំដាក់ពាក្យទាមទារសំណង?",
      a: "AI របស់យើងពាក់មួកអ្នកស៊ើបអង្កេត វាយតម្លៃការទាមទារដោយផ្អែកលើទិន្នន័យអាកាសធាតុ និងភស្តុតាងរបស់អ្នក។ អ្នកនឹងទទួលបានការសម្រេចចិត្តលឿនជាងសំឡេងផ្គរលាន់!",
    },
    {
      q: "តើខ្ញុំត្រូវបង់ថ្លៃឧស្ម័នទេ?",
      a: "ទេ! យើងគ្របដណ្តប់ឱ្យអ្នក។ CropSafe ប្រើ Paymaster របស់ Base chain ដើម្បីដោះស្រាយថ្លៃឧស្ម័ន។ វាដូចជាមានធុងឧស្ម័នពេញជានិច្ច!",
    },
  ],
  my: [
    {
      q: "မူဝါဒအသစ်တစ်ခုကို ဘယ်လိုဖန်တီးရမလဲ။",
      a: "အရမ်းလွယ်ပါတယ်! ဒက်ရှ်ဘုတ်ကနေ 'မူဝါဒအသစ်ဖန်တီးရန်' ကိုနှိပ်ပြီး အဆင့်တွေကိုလိုက်လုပ်ပါ။ ဒါဟာ ပီဇာမှာတာနဲ့တူပါတယ်၊ ဒါပေမယ့် သီးနှံအာမခံအတွက်ပါ!",
    },
    {
      q: "ပရီမီယံကို ဘယ်လိုတွက်ချက်ပါသလဲ။",
      a: "ကျွန်တော်တို့ရဲ့ AI က 'ရာသီဥတုခန့်မှန်းချက်' လို့ပြောလိုက်တာနဲ့ နံပါတ်တွေကို ပိုမြန်ဆန်စွာတွက်ချက်ပါတယ်! ၎င်းသည် သမိုင်းဝင်ရာသီဥတုအချက်အလက်များနှင့် သင့်မူဝါဒအသေးစိတ်အချက်အလက်များကို ခွဲခြမ်းစိတ်ဖြာပြီး မျှတသောပရီမီယံကို ထုတ်လုပ်ပါသည်။",
    },
    {
      q: "တောင်းဆိုမှုကို ဘယ်လိုတင်သွင်းရမလဲ။",
      a: "ဆဲလ်ဖီရိုက်သလိုပဲ လွယ်ကူပါတယ်! 'ကျွန်ုပ်၏မူဝါဒများ' သို့သွားပါ၊ သက်ဆိုင်ရာမူဝါဒကိုရွေးချယ်ပြီး 'တောင်းဆိုမှုတင်သွင်းရန်' ကိုနှိပ်ပါ။ ကျွန်ုပ်တို့၏ AI က ထိုနေရာမှ ဆက်လက်ဆောင်ရွက်ပါမည။",
    },
    {
      q: "တောင်းဆိုမှုတင်သွင်းပြီးနောက် ဘာဖြစ်မလဲ။",
      a: "ကျွ���်ုပ်တို့၏ AI သည် စုံထောက်ဦးထုပ်ကိုဆောင်းပြီး ရာသီဥတုအချက်အလက်နှင့် သင့်သက်သေအထောက်အထားများအပေါ် အခြေခံ၍ တောင်းဆိုမှုကို အကဲဖြတ်ပါသည်။ မိုးကြိုးပစ်သံထက် မြန်ဆန်စွာ ဆုံးဖြတ်ချက်ကို သင်ရရှိပါလိမ့်မည်!",
    },
    {
      q: "ဓာတ်ငွေ့ကုန်ကျစရိတ်ကို ပေးဆောင်ရန် လိုပါသလား။",
      a: "မလိုပါဘူး! ကျွန်တော်တို့က သင့်အတွက် ကာမိပါတယ်။ CropSafe သည် ဓာတ်ငွေ့ကုန်ကျစရိတ်များကို ကိုင်တွယ်ရန် Base chain ၏ Paymaster ကို အသုံးပြုပါသည်။ ဓာတ်ငွေ့တိုင်ကီအပြည့် အမြဲရှိနေသလိုပါပဲ!",
    },
  ],
  lo: [
    {
      q: "ຂ້ອຍຈະສ້າງນະໂຍບາຍໃໝ່ໄດ້ແນວໃດ?",
      a: "ງ່າຍຫຼາຍ! ພຽງແຕ່ຄລິກທີ່ 'ສ້າງນະໂຍບາຍໃໝ່' ຈາກແຜງຄວບຄຸມ ແລະປະຕິບັດຕາມຂັ້ນຕອນ. ມັນຄືກັບການສັ່ງິດຊາ, ແຕ່ສຳລັບການປກັນໄພພືດ!",
    },
    {
      q: "ຄ່າທຳນຽມຄິດໄລ່ແນວໃດ?",
      a: "AI ຂອງພວກເຮົາຄິດໄລ່ຕົວເລກໄວກວ່າທີ່ທ່ານສາມາດເວົ້າວ່າ 'ພະຍາກອນອາກາດ'! ມັນວິເຄາະຂໍ້ມູນສະພາບອາກາດໃນອະດີດ ແລະລາຍລະອຽດນະໂຍບາຍຂອງທ່ານເພື່ອສ້າງຄ່າທຳນຽມທີ່ເປັນທຳ.",
    },
    {
      q: "ຂ້ອຍຈະຍື່ນຄຳຮ້ອງຂໍໄດ້ແນວໃດ?",
      a: "ມັນງ່າຍເທົ່າກັບການຖ່າຍຮູບເຊລຟີ! ໄປທີ່ 'ນະໂຍບາຍຂອງຂ້ອຍ', ເລືອກນະໂຍບາຍທີ່ກ່ຽວຂ້ອງ, ແລະກົດ 'ຍື່ນຄຳຮ້ອງຂໍ'. AI ຂອງພວກເຮົາຈະຈັດການສ່ວນທີ່ເຫຼືອ.",
    },
    {
      q: "ຫຼັງຈາກຂ້ອຍສົ່ງຄຳຮ້ອງຂໍແລ້ວຈະເກີດຫຍັງຂຶ້ນ?",
      a: "AI ຂອງພວກເຮົາໃສ່ໝວກນັກສືບ, ປະເມີນຄຳຮ້ອງຂໍໂດຍອີງໃສ່ຂໍ້ມູນສະພາບອາກາດ ແລະຫຼັກຖານຂອງທ່ານ. ທ່ານຈະໄດ້ຮັບຄຳຕັດສິນໄວກວ່າສຽງຟ້າຮ້ອງ!",
    },
    {
      q: "ຂ້ອຍຕ້ອງຈ່າຍຄ່າທຳນຽມແກັສບໍ?",
      a: "ບໍ່! ພວກເຮົາຮັບຜິດຊອບໃຫ້ທ່ານ. CropSafe ໃຊ້ Paymaster ຂອງ Base chain ເພື່ອຈັດການກັບຄ່າທຳນຽມແກັສ. ມັນຄືກັບການມີຖັງແກັສເຕັມຕະຫຼອດເວລາ!",
    },
  ],
};

function FAQs({ selectedLanguage }: FAQsProps) {
  const t = (key: TranslationKey) => translations[selectedLanguage][key];
  const faqs =
    faqsData[selectedLanguage as keyof typeof faqsData] || faqsData.en;

  return (
    <div className="faq-section py-4 sm:py-6 bg-gray-50 w-full">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{t("faq")}</h2>
        <Accordion.Root type="single" collapsible className="space-y-4 w-full">
          {faqs.map((faq, index) => (
            <Accordion.Item
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg shadow-md overflow-hidden w-full"
            >
              <Accordion.Header className="w-full">
                <Accordion.Trigger className="w-full p-4 flex justify-between items-center text-left font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none">
                  <span className="flex-grow pr-4">{faq.q}</span>
                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-green-600 transform transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="p-4 text-gray-600 w-full">
                <p>{faq.a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </div>
  );
}

export default FAQs;
