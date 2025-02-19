import { Component, Renderer2 } from '@angular/core';
import { BanksApiService } from '../../../../services/banks-api.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-setting-bank',
  standalone: true,
  //imports: [CommonModule, FormsModule],
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './setting-bank.component.html',
  styleUrl: './setting-bank.component.css'
})
export class SettingBankComponent {

  banks: any[] = [];
  newBank: string = '';
  editingBankId: number | null = null;
  constructor(private bankApiService: BanksApiService,
    private renderer: Renderer2,
    private router: Router,) { }

  ngOnInit(): void {
    this.loadBanks();
    this.loadScriptsSequentially();
    this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');
  }

  loadBanks(): void {
    this.bankApiService.getPosts().subscribe(
      (response) => {
        // Yanıttan bankalar dizisini almak için
        if (Array.isArray(response.data.items)) {
          this.banks = response.data.items; // Burada response.data.items içindeki bankalar dizisini alıyoruz
        } else {
          console.error('Beklenmeyen veri formatı:', response.data);
          this.banks = []; // Hata durumunda boş dizi
        }
      },
      (error) => {
        console.error('Error fetching banks:', error);
        this.banks = []; // Hata durumunda boş dizi
      }
    );
  }

  editBank(id: number, bankName: string): void {
    this.router.navigate(['/settingBankUpdate', id]); // Düzenleme bileşenine yönlendir
  }

  addBank(): void {
    if (!this.newBank) return;

    this.bankApiService.createPost({ bankName: this.newBank }).subscribe(
      (data) => {
        this.banks.push(data);
        this.newBank = '';

        // Başarılı ekleme alert'i
        alert('Bank başarıyla eklendi!');
      },
      (error) => {
        console.error('Error adding bank:', error);
        // Hata mesajını kontrol et ve kullanıcıya bildirim göster
        if (error.error && error.error.message) {
          alert(error.error.message); // Sunucudan gelen hata mesajını göster
        } else {
          alert('Banka eklenirken bir hata oluştu.'); // Genel bir hata mesajı
        }
      }
    );
  }

  
  updateBank(): void {
    if (this.editingBankId === null || !this.newBank) return;

    const updatedBank = { id: this.editingBankId, banksName: this.newBank };

    this.bankApiService.updatePost(this.editingBankId, updatedBank).subscribe(
      (data) => {
        const index = this.banks.findIndex(bank => bank.id === this.editingBankId);
        if (index > -1) {
          this.banks[index] = data; // Güncellenen veriyi dizide değiştir
        }
        this.newBank = '';
        this.editingBankId = null;

        alert('Güncelleme başarılı!');
        this.router.navigate(['/settingBank']); // Yönlendirme
      },
      (error) => {
        console.error('Error updating bank:', error);
      }
    );
  }
  cancelEdit(): void {
    this.editingBankId = null;
    this.newBank = '';
  }

  deleteBank(id: number): void {""
  this.router.navigate(['/settingBankDelete', id]); // Silme bileşenine yönlendir
}

  async loadScriptsSequentially() {
    try {
      await this.loadScript('assets/vendor/jquery/jquery.min.js');
      console.log('jQuery yüklendi.');
      await this.loadScript('assets/vendor/datatables/jquery.dataTables.min.js');
      console.log('DataTables JS yüklendi.');
      await this.loadScript('assets/vendor/datatables/dataTables.bootstrap4.min.js');
      console.log('Bootstrap DataTables yüklendi.');
      await this.loadScript('assets/js/demo/datatables-demo.js');
      console.log('Demo script yüklendi.');
      await this.loadScript('assets/js/test.js');
      console.log('Test script yüklendi.');
    } catch (error) {
      console.error(error);
    }
  }
  loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(`Script yüklenemedi: ${scriptUrl}`);
      document.body.appendChild(script);
    });
  }

  private loadCss(url: string) {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    this.renderer.appendChild(document.head, link);
  }

}
