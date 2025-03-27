import os
import requests

# Lista de nomes dos colaboradores
colaboradores = [
    "Alifer Vinicius Tibes",
    "Alysson Alquieri Kooke",
    "André Filipe Lima Valença Pereira",
    "Angelo Guilherme Sfreddo",
    "Anísio Silva Leite",
    "Bruno Cabral da Silva",
    "Caio Vinícius Aragão Duarte",
    "Camile Vitória Zanela",
    "Douglas Rodrigues de Almeida",
    "Eduardo Vitor Porfirio",
    "Eliel José Rossi Diniz Lopes",
    "Emerson Henrique Comar",
    "Ezequiel José Mulinari",
    "Francisco Júnior Pansera Zattera",
    "Gabriel Donini Reck",
    "Henrique Miguel Hart Kuhn",
    "Hevellym Larissa de Siqueira Melo",
    "Higor Sousa de Oliveira",
    "Jailson Pirã Lemes",
    "Jefferson Byller Gomes dos Santos",
    "João Pedro Zandoná",
    "Jose Marinho da Silva",
    "Leodimar Collette",
    "Lucas Prigol",
    "Luiz Gabriel Paganini da Silva",
    "Luiz Miguel Martins de Fraga",
    "Marcus Antônio Toledo Silva",
    "Nalberth Alberto Macedo dos Santos",
    "Pedro Felipe Silva de Sousa",
    "Rafael da Conceição Silveira",
    "Rafael Vargas Rodrigues Alves",
    "Tamara Ramalho de Oliveira",
    "Tamirys Tereza Altenhofer",
    "Thalia Mohr",
    "Victor Hugo Araújo Dantas",
    "Willian Santos Hora",
    "Willyan Paproski Bueno"
]

# Lista de URLs das imagens
urls = [
    "https://drive.google.com/thumbnail?id=1yul7_JOlME-Ji5GXPxM1bmpOT_knr49I",
    "https://drive.google.com/thumbnail?id=12fU2wYjqhrOG78sdr7tYHoH5N7mEvIoY",
    "https://drive.google.com/thumbnail?id=1ZwMw_mgKlMYxc8reg2O4u6-GHaMANYVp",
    "https://drive.google.com/thumbnail?id=1ioDcOHAA27whAoFjNdc9PnYw9bpaoflb",
    "https://drive.google.com/thumbnail?id=1FWhJj81hBGfB0MsK_Dt65-l13BXtRrOb",
    "https://drive.google.com/thumbnail?id=1eJmUC4dxqIbh7unY-GwQ3kML824JVK-1",
    "https://drive.google.com/thumbnail?id=1268gpc2y0egWAWJ3bX4SbFvecLsAhriX",
    "https://drive.google.com/thumbnail?id=1zx3pv_aBBmYKrysnu-98KGyPNFL-LjGs",
    "https://drive.google.com/thumbnail?id=1-5Ewi46-dtguni5UR_2uk3S-jY4Wke5o",
    "https://drive.google.com/thumbnail?id=1pykfWTqQt2x586vQZg2-07IHpkLGpq8F",
    "https://drive.google.com/thumbnail?id=1hCv_DzIYzHMonFLyLoS9IhaNIuyuEcYZ",
    "https://drive.google.com/thumbnail?id=1hLm54CHhL4IgwKXXTLFQncA69yGN8hsz",
    "https://drive.google.com/thumbnail?id=1ybSiwIiAD_BtojxgMAoJvH4dfp6_N-ph",
    "https://drive.google.com/thumbnail?id=1VXlqCnJKlfyBrZ21QJT7oqqDgSYBGFND",
    "https://drive.google.com/thumbnail?id=1yTx6H1l6i-LXWSJUQ8nw774Urq1MDRGF",
    "https://drive.google.com/thumbnail?id=1l7DyPVQHqfDAvMqNcGBhKikXHR69ZG--",
    "https://drive.google.com/thumbnail?id=1hHmsx_vRq-vUiao-E2HcX94aclR1TZJW",
    "https://drive.google.com/thumbnail?id=1s9ufQRmSe8vbTucKXP2MICid06lxRqx7",
    "https://drive.google.com/thumbnail?id=1ffSc7bTeNEK43AXmh6grv0RA1z_KMPAV",
    "https://drive.google.com/thumbnail?id=1xgo08VfD-P5ehAxMzxuwblatJhNZhK5L",
    "https://drive.google.com/thumbnail?id=1ZM3MQ0ptd2T05j6MXbEFsyN061LKgSsO",
    "https://drive.google.com/thumbnail?id=1EXxPg5BbuqUDU3cnlTmu45Ui6CbQ7W-s",
    "https://drive.google.com/thumbnail?id=1qqj9IwntAs98n7AYxL86IqpBEyej3lDJ",
    "https://drive.google.com/thumbnail?id=1bowYFti83IlzkkSRDuKrr9wllMfLMTJh",
    "https://drive.google.com/thumbnail?id=1S4VrcytvruGVRw7xGALpWg12P-qTf4-W",
    "https://drive.google.com/thumbnail?id=1UzWxqToPWdjZ6XWFNzbgcT95MzfkOEAl",
    "https://drive.google.com/thumbnail?id=1vjunWqiUtBjsSI1k6yTb2FNhzkTHwWMZ",
    "https://drive.google.com/thumbnail?id=1pWmu30Y_X7wcFdAC_la6G6vvvr9SJIX7",
    "https://drive.google.com/thumbnail?id=1RLPlydErmyUwLsuDoH_WoLLpIfts2iZa",
    "https://drive.google.com/thumbnail?id=18lRVeEtMGfr0iCUhi3EZV7fUF2nkrn9D",
    "https://drive.google.com/thumbnail?id=127rb3TRwaLr2_BIY9M5bI9fsDQ73W31Y",
    "https://drive.google.com/thumbnail?id=1Qd2sHGSIzI9h1KnR3DJIWJnDBCsFfD6S",
    "https://drive.google.com/thumbnail?id=1KyvCm9ro_KZojAAIFaAP-jOESrt6eS_-",
    "https://drive.google.com/thumbnail?id=1cQGdsBi2TL4vfJ90D2Mq0NSnu5dHMBz8",
    "https://drive.google.com/thumbnail?id=1i6bByPjlhSbDi63IFbg9fDmfElPWa-_P",
    "https://drive.google.com/thumbnail?id=1zpiQQ4nuWKghbynr3PUvzwPVXoM_6gEp",
    "https://drive.google.com/thumbnail?id=1T8h4Tb_bLMwcH1eLNb0YJBNNtypA_IRp"
]

# Criar pasta para salvar as imagens
output_dir = "colaboradores_fotos"
os.makedirs(output_dir, exist_ok=True)

# Baixar e salvar as imagens
for nome, url in zip(colaboradores, urls):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            # Salvar a imagem com o nome do colaborador
            file_path = os.path.join(output_dir, f"{nome}.jpg")
            with open(file_path, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            print(f"Imagem de {nome} baixada com sucesso.")
        else:
            print(f"Falha ao baixar a imagem de {nome}. Status: {response.status_code}")
    except Exception as e:
        print(f"Erro ao baixar a imagem de {nome}: {e}")